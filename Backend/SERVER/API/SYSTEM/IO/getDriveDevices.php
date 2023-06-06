<?php
    header("Access-Control-Allow-Origin: *");
    $output = json_decode(shell_exec('lsblk -O -J'), true);
    $supportedTypes = ["ntfs", "ext2", "ext3", "ext4"];
    $devices = [];
    $used = [];

    foreach ($output["blockdevices"] as $blockdevice) {
    foreach ($blockdevice["children"] as $child) {
        if (in_array($child["fstype"], $supportedTypes)) {
        shell_exec("udisksctl mount -b " . $child["path"]);
        $device = [
            "mountpoint" => $child["mountpoint"],
            "name" => $child["partlabel"] ?: "Unamed Drive",
            "fsuse" => preg_replace('/[^0-9]/', '', $child["fsuse%"]),
            "fstype" => $child["fstype"],
            "type" => "hdd"
        ];
        if ($child["mountpoint"] === "/") {
            $device["name"] = "File System";
        }
        if (!in_array($device["name"], $used)) {
            $devices[] = $device;
            $used[] = $device["name"];
        }
        }
    }
    }

    echo json_encode($devices);
?>