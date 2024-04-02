<?php
    // {"state" : true, "data": "所有會員資料", "message" : "讀取成功!"}
    // {"state" : false, "message" : "讀取失敗!"}
    
    $servername = "localhost";
    $username = "owner01";
    $password = "123456";
    $dbname = "vllvDB";

    $conn = mysqli_connect($userserver, $username, $password, $dbname);
    if(!$conn){
            die("連線失敗! 請查明原因 並排除。".mysqli_connect_error());
    }
    $sql = "SELECT * FROM member ORDER BY Username ASC";
    $result = mysqli_query($conn, $sql);
    IF (mysqli_num_rows($result) > 0){
        $mydata = array();
        while($row = mysqli_fetch_assoc($result)){
            $mydata[] = $row;
        }
        echo '{"state" : true , "data":'.json_encode($mydata).' , "message" : "查詢資料成功"}';
    }else{
        echo '{"state" : false, "message" : "member-Read-api.php 讀取失敗!"}';
    }
    mysqli_close($conn);
?>