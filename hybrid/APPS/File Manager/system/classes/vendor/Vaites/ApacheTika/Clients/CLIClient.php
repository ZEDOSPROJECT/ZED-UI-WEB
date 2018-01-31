<?php

namespace Vaites\ApacheTika\Clients;

use Exception;
use Vaites\ApacheTika\Client;
use Vaites\ApacheTika\Metadata\Metadata;

class CLIClient extends Client {
    /**
     * Apache Tika app path.
     *
     * @var string
     */
    protected $path = null;

    /**
     * Configure client and test if file exists
     *
     * @param string $path
     *
     * @throws Exception
     */
    public function __construct($path = null)
    {
        $this->path = realpath($path);

        if(!file_exists($this->path))
        {
            throw new Exception("Apache Tika JAR not found ($path)");
        }
    }

    /**
     * Configure and make a request and return its results.
     *
     * @param string $type
     * @param string $file
     *
     * @return string
     *
     * @throws \Exception
     */
    public function request($type, $file = null)
    {
        // check if is cached
        if(isset($this->cache[sha1($file)][$type]))
        {
            return $this->cache[sha1($file)][$type];
        }

        // parameters for command
        $arguments = [];
        switch($type)
        {
            case 'html':
                $arguments[] = '--html';
                break;

            case 'lang':
                $arguments[] = '--language';
                break;

            case 'mime':
                $arguments[] = '--detect';
                break;

            case 'meta':
                $arguments[] = '--metadata --json';
                break;

            case 'text':
                $arguments[] = '--text-main';
                break;

            case 'version':
                $arguments[] = '--version';
                break;

            default:
                throw new Exception("Unknown type $type");
        }

        // invalid local file
        if($file && !preg_match('/^http/', $file) && !file_exists($file))
        {
            throw new Exception("File can't be opened");
        }
        // invalid remote file
        elseif($file && !file_get_contents($file, 0, null, 0, 1))
        {
            throw new Exception("File can't be opened", 2);
        }

        // add last argument
        if($file)
        {
            $arguments[] = escapeshellarg($file);
        }

        // build command
        $command = "java -jar ".escapeshellarg($this->path)." " . implode(' ', $arguments);

	    if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
		    $command .= "  && exit";
	    } else {
		    $command .= " 2>&1";
	    }

        // run command
	    $response = array();
	    $return_code = 0;

	    session_write_close();
	    exec($command, $response, $return_code);
	    if ($return_code != 0) {
		    echo " * returned code: ".$return_code."<br>";
		    echo " * returned text: ";
		    print_r($response);
		    return false;
	    }
	    $response = implode("\n", $response);

        // metadata response
        if($type == 'meta')
        {
            // fix for invalid? json returned only with images
            $response = str_replace(basename($file) . '"}{', '", ', $response);

            $response = Metadata::make($response, $file);
        }

        // cache certain responses
        if(in_array($type, ['lang', 'meta']))
        {
            $this->cache[sha1($file)][$type] = $response;
        }

        return $response;
    }
}
