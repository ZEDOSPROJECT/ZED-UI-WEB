<?php
    header("Access-Control-Allow-Origin: *");

    function get_server_memory_usage(){
        $free = shell_exec('free');
        $free = (string)trim($free);
        $free_arr = explode("\n", $free);
        $mem = explode(" ", $free_arr[1]);
        $mem = array_filter($mem);
        $mem = array_merge($mem);
        $memory_usage = $mem[2]/$mem[1]*100;

        return $memory_usage;
    }

    function get_server_cpu_usage(){

        $loads = sys_getloadavg();
        $core_nums = trim(shell_exec("grep -P '^processor' /proc/cpuinfo|wc -l"));
        $load = round($loads[0]/($core_nums + 1)*100, 2);
        return $load;
    
    }

    $DATA["CPU"]=get_server_cpu_usage();
    $DATA["RAM"]=get_server_memory_usage();

    echo json_encode($DATA);

?>