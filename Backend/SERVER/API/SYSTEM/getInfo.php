<?php
    header("Access-Control-Allow-Origin: *");
    $data['OperatingSystem'] = "ZED OS";
    $data['Version'] = "2021";
    $data['Kernel'] = php_uname("r");

    $cpuinfo = file('/proc/cpuinfo');
    

    $data['CPU'] = explode(":",$cpuinfo[4])[1];
    $data['RAM'] = round(intval(getSystemMemInfo()["MemTotal"])/1024/1024)." GB";
    $data['STORAGE'] = ConvertBytes(disk_total_space("/"));
    echo json_encode($data);

    function getSystemMemInfo() 
    {       
        $data = explode("\n", file_get_contents("/proc/meminfo"));
        $meminfo = array();
        foreach ($data as $line) {
            list($key, $val) = explode(":", $line);
            $meminfo[$key] = trim($val);
        }
        return $meminfo;
    }  
    
    function ConvertBytes($number)
    {
        $len = strlen($number);
        if($len < 4)
        {
            return sprintf("%d b", $number);
        }
        if($len >= 4 && $len <=6)
        {
            return sprintf("%0.2f Kb", $number/1024);
        }
        if($len >= 7 && $len <=9)
        {
            return sprintf("%0.2f Mb", $number/1024/1024);
        }
        return sprintf("%0.2f Gb", $number/1024/1024/1024);                           
    }

?>