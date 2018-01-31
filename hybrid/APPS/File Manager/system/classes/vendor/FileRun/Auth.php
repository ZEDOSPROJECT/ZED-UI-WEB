<?php
namespace FileRun;

class Auth extends Utils\DP {

	var $debug = false;
	var $usersTable = "df_users";
	var $usersPermsTable = "df_users_permissions";
	var $table = "df_users";
	var $cookieName = "FileRun";
	var $currentUserInfo = false;
	var $TwoStep = false;
	var $error = false;
	var $errorCode = false;
	var $loggedInUsername = false;
	var $sess;
	var $customAuth;

	function __construct() {
		$this->sess = new authSessions();
	}
	function hasValidCookie($checkCSRF = false) {

		if ($checkCSRF) {//if using PHP sessions
			global $settings;
			if ($settings->logout_inactivity > 0) {
				if (!$_POST['csrf']) {return false;}
				if (!$_SESSION[$this->cookieName]['csrf_token']) {return false;}
				if (\S::fromHTML($_POST['csrf']) == \S::fromHTML($_SESSION[$this->cookieName]['csrf_token'])) {
					return true;
				}
			}
		}

		$token = $this->sess->getRemoteToken();
		if (!$token) {return false;}
		$rs = $this->sess->checkToken($token, $checkCSRF);
		if ($this->debug && $rs) {
			echo ' [has valid cookie] ';
		}
		return $rs;
	}
	function hasValidPHPSession() {
		$this->initPHPSession();
		return strlen($_SESSION[$this->cookieName]['username']) > 0;
	}
	function initPHPSession() {
		if (!session_id()) {
			if ($this->debug) {echo ' [filerun session started] ';}
			session_name('FileRunSID');
			@session_start();
		}
	}
	function markUserAsLoggedIn($username) {
		if ($this->debug) {echo ' [marking user as logged in] ';}
		$this->renewSessionId();
		$_SESSION[$this->cookieName]['session_start'] = time();
		$_SESSION[$this->cookieName]['username'] = strtolower($username);
	}

	function renewSessionId() {
		$this->initPHPSession();
		$_SESSION['test'] = time();
		session_regenerate_id(true);
	}

	function ssoAvailable() {
		global $settings;
		if (!$settings->auth_plugin) {return false;}
		if (!$this->customAuth) {$this->initCustomClass();}
		if (!$this->customAuth) {return false;}
		if (method_exists($this->customAuth, 'ssoEnabled')) {
			return $this->customAuth->ssoEnabled();
		}
		return method_exists($this->customAuth, 'singleSignOn');
	}

	function ssoOnly() {
		global $settings;
		if (!$settings->auth_plugin) {return false;}
		if (!$this->customAuth) {$this->initCustomClass();}
		if (!$this->customAuth) {return false;}
		return !method_exists($this->customAuth, 'authenticate');
	}
	
	function singleSignOn() {
		global $settings;
		if ($settings->auth_plugin) {
			$rs = $this->initCustomClass();
			if ($rs) {
				if (method_exists($this->customAuth, 'singleSignOn')) {
					if (method_exists($this->customAuth, 'ssoEnabled')) {
						if (!$this->customAuth->ssoEnabled()) {
							$this->errorCode = 'NO-SSO';
							$this->error = 'Single-sign-on is not enabled';
							return false;
						}
					}

					$username = strtolower($this->customAuth->singleSignOn());
					if (!$username) {
						$this->errorCode = 'PLUGIN_NO_SSO_SESSION';
						if ($this->customAuth->error) {
							$this->error = $this->customAuth->error;
						} else {
							$this->error = 'You are not logged in';
						}
						return false;
					}
					$rs = $this->validateAccount($username);
					if (!$rs) {
						if ($this->errorCode == 'USERNAME_NOT_FOUND') {
							$userInfo = $this->customAuth->getUserInfo($username);
							if (!$userInfo) {
								return false;
							}
							$userData = $userInfo['userData'];
							$userPerms = $userInfo['userPerms'];
							$userGroups = $userInfo['userGroups'];
							$userData['username'] = $username;
							$rs = $this->insertLocalUser($userData, $userPerms, $userGroups);
							if (!$rs) {return false;}
							$userData['id'] = $rs;
							$this->currentUserInfo = $userData;
						}
					}
					//some third-party apps take over the session handling
					if (session_id() && session_name() != 'FileRunSID') {
						session_write_close();
						ini_set('session.save_handler', 'files');
						if ($_COOKIE['FileRunSID']) {
							session_id($_COOKIE['FileRunSID']);
						}
						session_name('FileRunSID');
						@session_start();
					}
					$this->markUserAsLoggedIn($username);
					return true;
				}
			}
		}
		return false;
	}

	function initCustomClass() {
		global $settings, $config;
		if ($this->customAuth) {return true;}
		$className = 'customAuth_'.$settings->auth_plugin;
		$customAuthFile = gluePath($config['path']['root'], "/customizables/auth/", $settings->auth_plugin.'.auth.php');
		if (!is_file($customAuthFile)) {return false;}
		require_once($customAuthFile);
		if (!class_exists($className)) {echo 'Class '.$className.' not found';exit();}
		$this->customAuth = new $className;
		return true;
	}


	function validateAccount($username = false) {
		if (!$username) {
			$username = $_SESSION[$this->cookieName]['username'];
		}
		//todo: this function does not check the plugins if the 3rd party user account still exists or is valid
		if (!$this->currentUserInfo) {
			$this->currentUserInfo = $this->selectOne('*', array('username', '=', $this->q(strtolower($username))));
		}
		if (!$this->currentUserInfo) {
			if ($this->debug) {echo ' [username '.$username.' not found in local database] ';}
			$this->error = "Invalid username.";
			$this->errorCode = 'USERNAME_NOT_FOUND';
			return false;
		}
		if (!$this->currentUserInfo['activated']) {
			if ($this->debug) {echo ' [local account deactivated] ';}
			$this->error = "Your account has been deactivated!";
			$this->errorCode = 'DEACTIVATED';
			return false;
		}
		if ($this->debug) {echo ' [accounts has been validated] ';}
		return true;
	}

	function checkIP($username) {
		global $config;
		$IPLimit = $config['app']['login']['restrict_ip'][strtolower($username)];
		if ($IPLimit) {
			$ipAddr = getIP();
			$pass = false;
			if ($ipAddr == $IPLimit) {
				$pass = true;
			} else {
				if (Utils\Network::ip_in_range($ipAddr, $IPLimit)) {$pass = true;}
			}
			if (!$pass) {
				$this->error = "Your account access is limited to a particular IP address!";
				$this->errorCode = 'IP_MISMATCH';
				return false;
			}
		}
		return true;
	}

	function authenticate_custom($username, $password) {
		global $settings;
		$rs = $this->initCustomClass();
		if (!$rs) {
			$this->error = 'Failed to initialize custom authentication plugin class';
			$this->errorCode = 'PLUGIN_CONFIG';
			return false;
		}
		if (!method_exists($this->customAuth, 'authenticate')) {
			//the allows the FileRun superuser (username=admin) to login using the local credentials
			$this->errorCode = 'PLUGIN_CONFIG';
			$this->error = 'Authentication should be made with the remote system.';
			return false;
		}
		$userInfo = $this->customAuth->authenticate($username, $password);
		if (is_array($userInfo)) {//user has proper credentials
			$userData = $userInfo['userData'];
			$userPerms = $userInfo['userPerms'];
			$userGroups = $userInfo['userGroups'];
			//check to see if user already in local database
			$existingUserInfo = $this->selectOne('*', array('LOWER(username)', '=', $this->q($username)));
			if ($existingUserInfo) {
				if ($settings->auth_sync_passwords) {
					$hashedPass = self::hashPassword($password);
					if ($hashedPass != $existingUserInfo['password']) {
						//update stored password
						$this->updateById(array('password' => $hashedPass, 'last_pass_change' => 'NOW()'), $existingUserInfo['id']);
					}
				}
				return true;
			} else {
				$userData['username'] = $username;
				return $this->insertLocalUser($userData, $userPerms, $userGroups);
			}
		} else {
			//custom auth failed
			if ($this->customAuth->error) {
				$this->error = $this->customAuth->error;
				$this->errorCode = $this->customAuth->errorCode;
			} else {
				$this->error = "Authentication failed.";
				$this->errorCode = 'CUSTOM_FAIL';
			}
			return false;
		}
	}

	function insertLocalUser($userData, $userPerms, $userGroups) {
		global $lx, $settings, $fm;
		if ($lx->c()) {
			$userData['username'] = strtolower($userData['username']);
			if ($settings->auth_sync_passwords && $userData['password']) {
				$userData['password'] = self::hashPassword($userData['password']);
			} else {
				$userData['password'] = NULL;
			}
			$userData['activated'] = 1;
			$userData['last_login_date'] = 'NOW()';
			$userData['registration_date'] = 'NOW()';
			if (!array_key_exists('role', $userPerms)) {
				$userPerms['role'] = $settings->user_registration_default_role;
			}
			if (!$userPerms['role']) {
				$this->error = 'A role needs to be assigned to new users!';
				$this->errorCode = '3RDA_NO_ROLE';
				return false;
			}
			$rs = $this->insert($userData);
			$user_id = $this->lastInsertId();
			$userPerms['uid'] = $user_id;
			if ($rs) {
				//automatically create groups and assign user to them
				if (sizeof($userGroups) > 0) {
					$groups = UserGroups::getTable();
					foreach ($userGroups as $groupName) {
						$gid = $groups->selectOneCol("id", array("name", "=", $groups->q($groupName)));
						if (!$gid) {
							$groupData['name'] = $groupName;
							$groupData['description'] = "";
							$rs = $groups->insert($groupData);
							if ($rs) {
								$gid = $groups->lastInsertId();
							}
						}
						if ($gid) {
							UserGroups::addUserToGroup($user_id, $gid);
						}
					}
				}
				if (is_array($settings->user_registration_default_groups)) {
					foreach ($settings->user_registration_default_groups as $gid) {
						UserGroups::addUserToGroup($user_id, $gid);
					}
				}
				$roleInfo = UserRoles::getInfo($userPerms['role']);
				if (!$userPerms['homefolder']) {
					$userPerms['homefolder'] = Perms::applyPathTemplate($roleInfo['homefolder'], $userData);
					$userPerms['homefolder'] = $fm->normalizePath($userPerms['homefolder']);
				}
				$this->table = $this->usersPermsTable;
				$this->insert($userPerms);
				$this->table = $this->usersTable;
				return $user_id;
			} else {
				$this->error = "Failed to insert user to local database!";
				$this->errorCode = 'SQL_FAIL';
				return false;
			}
		} else {
			$this->error = "The software's license limits the creation of new user accounts!";
			$this->errorCode = 'LICENSE_LIMIT';
			return false;
		}
	}

	function authenticate_local($username, $password) {
		$this->currentUserInfo = $this->selectOne('*', array('username', '=', $this->q($username)));
		if (!$this->currentUserInfo) {
			$this->error = "Invalid username.";
			$this->errorCode = 'USERNAME_NOT_FOUND';
			return false;
		}
		if (!$this->currentUserInfo['activated']) {
			$this->error = "Your account has been deactivated!";
			$this->errorCode = 'DEACTIVATED';
			return false;
		}
		$passwordIsCorrect = $this->verifyPassword($password, $this->currentUserInfo['password']);
		if (!$passwordIsCorrect) {
			$this->error = "Invalid password.";
			$this->errorCode = 'WRONG_PASS';
			return false;
		}
		return true;
	}

	function validateOTP($otp, $two_step_secret) {
		if ($this->currentUserInfo['two_step_enabled']) {
			if ($this->currentUserInfo['two_step_secret']) {
				if (!$otp) {
					$this->error = "Your account is configured for 2-step verification. You need to type in a verification code!";
					$this->errorCode = '2FA_ASK_OTP';
					return false;
				} else {
					$g = new \GoogleAuthenticator();
					if (($this->currentUserInfo['last_otp'] && md5($otp) == $this->currentUserInfo['last_otp']) || !$g->checkCode($this->currentUserInfo['two_step_secret'], $otp)) {
						$this->error = "The provided verification code is not valid!";
						$this->errorCode = '2FA_WRONG_OTP';
						$this->TwoStep['currentCode'] = $g->getCode($this->currentUserInfo['two_step_secret']);//for logging
						return false;
					}
				}
			} else {
				if ($two_step_secret) {
					$g = new \GoogleAuthenticator();
					if ($g->checkCode($two_step_secret, $otp)) {
						$this->TwoStep['secret'] = $two_step_secret;
					} else {
						$this->error = "The provided verification code is not valid!";
						$this->errorCode = '2FA_WRONG_OTP';
						$this->TwoStep['currentCode'] = $two_step_secret;//for logging
						return false;
					}
				} else {
					$this->error = "Your account is configured for 2-step verification. Click Ok to start the setup.";
					$this->errorCode = '2FA_INIT';
					$g = new \GoogleAuthenticator();
					$this->TwoStep['secret'] = $g->generateSecret();
					$this->TwoStep['keyURI'] = $g->getKeyUri($this->currentUserInfo['username'], $_SERVER["HTTP_HOST"], $this->TwoStep['secret']);
					return false;
				}
			}
		}
		return true;
	}

	function authenticate($username, $password = false, $persistent = false, $otp = false, $two_step_secret = false) {
		global $settings;
		$success = false;
		$username = strtolower($username);
		if (!$username) {
			$this->error = "Please type an username.";
			$this->errorCode = 'TYPE_USERNAME';
			return false;
		}
		if (strlen($password) == 0) {
			$this->error = "Please type a password.";
			$this->errorCode = 'TYPE_PASS';
			return false;
		}
		$rs = $this->checkIP($username);
		if (!$rs) {return false;}
		$afterTheLastSlash = trim(strrchr($password, '/'), '/');
		if (strlen($afterTheLastSlash) == 6) {
			$otp = $afterTheLastSlash;
			$password = substr($password, 0, strlen($password)-7);
		}

		$performLocal = false;
		if ($settings->auth_plugin) {
			$success = $this->authenticate_custom($username, $password);
			if ($success) {
				if ($settings->auth_plugin_ip_mask) {
					if (!Utils\Network::ip_in_range(getIP(), $settings->auth_plugin_ip_mask)) {
						$success = false;
						$this->error = "Your account access is limited to a particular IP address!";
						$this->errorCode = 'IP_MISMATCH';
					}
				}
			} else {
				if ($this->errorCode == 'USERNAME_NOT_FOUND') {
					if ($settings->auth_allow_local) {
						$performLocal = true;
					}
				}
				if ($this->errorCode == 'PLUGIN_CONFIG' && strtolower($username) == 'admin') {
					$performLocal = true;
				}
			}
		} else {
			$performLocal = true;
		}

		if ($performLocal) {
			$success = $this->authenticate_local($username, $password);
		}
		if ($success) {
			$rs = $this->validateAccount($username);
			if (!$rs) {
				return false;
			}
			$rs = $this->validateOTP($otp, $two_step_secret);
			if (!$rs) {
				return false;
			}

			//ALL IS GOOD
			if (!$persistent) {
				$this->markUserAsLoggedIn($username);
			} else {
				$this->renewSessionId();
				$this->sess->setToken($username);
			}
			$updateData = array(
				"failed_login_attempts" => "0",
				"last_login_date" => 'NOW()'
			);
			if (isEmptyMySQLDate($this->currentUserInfo['last_notif_delivery_date'])) {
				$updateData['last_notif_delivery_date'] = 'NOW()';
			}
			if (!$this->currentUserInfo['two_step_secret'] && $this->TwoStep['secret']) {
				$updateData['two_step_secret'] = $this->TwoStep['secret'];
			}
			if ($otp) {
				$updateData['last_otp'] = md5($otp);
			}
			$this->updateById($updateData, $this->currentUserInfo['id']);
			return $this->currentUserInfo['id'];
		} else {
			if ($this->errorCode == 'WRONG_PASS') {
				if ($this->currentUserInfo['id'] != 1) {//not superuser
					if ($settings->max_login_attempts > 0) {
						if ($this->currentUserInfo['failed_login_attempts'] >= $settings->max_login_attempts) {
							$this->errorCode = 'FAIL_LIMIT';
							$this->updateById(array(
								"activated" => 0,
								"failed_login_attempts" => 0
							), $this->currentUserInfo['id']);
						} else {
							$this->updateById(array(
								"failed_login_attempts" => $this->currentUserInfo['failed_login_attempts']+1
							), $this->currentUserInfo['id']);
						}
					}
				}
			}
			return false;
		}
	}

	static function hashPassword($password) {
		return \password_hash($password , PASSWORD_DEFAULT, array("cost" => 10));
	}

	function verifyPassword($password, $hash) {
		if (substr($hash, 0, 4) != "$2y$") {//old hash format
			$passwordMatches = (md5($password) == $hash);
			if (!$passwordMatches) {return false;}
			$newHash = self::hashPassword($password);
			if ($newHash) {
				$this->update(["password" => $newHash], ['password', '=', md5($password)]);
			}
			return true;
		} else {//new hash format
			return \password_verify($password, $hash);
		}
	}

	function logout() {
		global $settings;
		$token = $this->sess->getRemoteToken();
		if ($token) {
			$rs = $this->sess->clearToken($token);
			if ($rs) {
				$this->sess->removeRemoteToken();
			}
		}
		$_SESSION[$this->cookieName] = array();
		$this->renewSessionId();
		$this->updateById(array("last_logout_date" => 'NOW()'), $this->currentUserInfo['id']);
		$this->currentUserInfo = false;
		if ($settings->auth_plugin) {
			$this->initCustomClass();
			if (method_exists($this->customAuth, 'logout')) {
				$this->customAuth->logout();
			}
		}
		return true;
	}
}

class authSessions extends Utils\DP {
	var $table = "df_users_sessions";
	static $cookieName = "FileRun";

	function getRemoteToken() {
		return \S::fromHTML($_COOKIE[self::$cookieName]['token']);
	}
	
	function setRemoteToken($token, $sessionCookie = false) {
		if ($sessionCookie) {
			$life = 0;
		} else {
			$life = time()+1209600;
		}
		return setcookie(self::$cookieName."[token]", $token, $life, false, false, isSSL(), true);
	}
	
	function removeRemoteToken() {
		setcookie(self::$cookieName."[token]", "", 1);
		setcookie(self::$cookieName."[token]", false);
		unset($_COOKIE[self::$cookieName]['token']);
		return true;
	}
	
	function setToken($username, $sessionCookie = false) {
		$token = sha1(uniqid(mt_rand().$username, true));
		$csrf_token = $this->generateCSRFToken();
		$userAgent = substr($_SERVER['HTTP_USER_AGENT'], 0,255);
		if (strlen($userAgent) == 0) {$userAgent = 'unknown';}
		$this->insert(array(
			'username' => $username,
			'token' => $token,
			'csrf_token' => $csrf_token,
			'user_agent' => $userAgent,
			'ip_address' => getIP(),
			'date' => 'NOW()'
		));
		return $this->setRemoteToken($token, $sessionCookie);
	}
	
	function checkToken($token, $checkCSRF = false) {
		//todo: add brute force protection
		$record = $this->getRecord($token);
		if (!$record) {
			$this->removeRemoteToken();
			return false;
		}
		//check user agent
		$userAgent = substr($_SERVER['HTTP_USER_AGENT'], 0,255);
		if ($userAgent != $record['user_agent']) {
			$this->clearToken($token);
			$this->removeRemoteToken();
			return false;
		}
		if ($checkCSRF) {
			//check posted token against db
			if (!$_POST['csrf']) {return false;}
			if (!$record['csrf_token']) {return false;}
			if (\S::fromHTML($_POST['csrf']) != $record['csrf_token']) {
				return false;
			}
		} else {
			//make sure there is an anti-CSRF token
			if (!$record['csrf_token']) {
				$this->updateRecordWithCSRFToken($record['id']);
			}
		}
		return $record['username'];
	}

	function getRecord($token = false) {
		if (!$token) {
			$token = $this->getRemoteToken();
			if (!$token) {return false;}
		}
		return $this->selectOne("*", array("token", "=", $this->q($token)));
	}

	function getCSRFToken() {
		global $settings;
		if ($settings->logout_inactivity > 0) {//using PHP sessions
			if (!$_SESSION[self::$cookieName]['csrf_token']) {
				$_SESSION[self::$cookieName]['csrf_token'] = $this->generateCSRFToken();
			}
			return $_SESSION[self::$cookieName]['csrf_token'];
		}
		$record = $this->getRecord();
		if (!$record) {return false;}
		if (!$record['csrf_token']) {
			$record['csrf_token'] = $this->updateRecordWithCSRFToken($record['id']);
		}
		return $record['csrf_token'];
	}

	private function generateCSRFToken() {
		return bin2hex(openssl_random_pseudo_bytes(32));
	}

	function updateRecordWithCSRFToken($recordId) {
		$csrf_token = $this->generateCSRFToken();
		$this->updateById(['csrf_token' => $csrf_token], $recordId);
		return $csrf_token;
	}
	
	function clearToken($token) {
		return $this->delete(array("token", "=", $this->q($token)));
	}

	function clearAllTokensForUser($username) {
		return $this->delete(array("username", "=", $this->q($username)));
	}

	function clearOld() {
		return $this->delete(array('date', '<', 'DATE_SUB(NOW(), INTERVAL 14 DAY)'));
	}
}