<?php
$url = $_GET['URL'];

if(urlOK($url)) {
//	 echo "<script>window.location='".$url."'</script>";
}else{
//	echo '<script>window.location="onErrorLoad.html";</script>';
}

function urlOK($url)
{

    $url_data = parse_url ($url);
    if (!$url_data) return FALSE;

   $errno="";
   $errstr="";
   $fp=0;

   $fp=fsockopen($url_data['host'],80,$errno,$errstr,30);

   if($fp===0) return FALSE;
   $path ='';
   if  (isset( $url_data['path'])) $path .=  $url_data['path'];
   if  (isset( $url_data['query'])) $path .=  '?' .$url_data['query'];

   $out="GET /$path HTTP/1.1\r\n";
   $out.="Host: {$url_data['host']}\r\n";
   $out.="Connection: Close\r\n\r\n";

   fwrite($fp,$out);
   $content=fgets($fp);
   $code=trim(substr($content,9,4)); //get http code
  echo $code; 
  fclose($fp);
   // if http code is 2xx or 3xx url should work
   return  ($code[0] == 2 || $code[0] == 3) ? TRUE : FALSE;
}

?>
