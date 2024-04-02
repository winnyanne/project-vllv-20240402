<?php
$userserver = "localhost";
$username = "owner01";
$password = "123456";
$dbname = "vllvDB";
// 建立連線
$conn = mysqli_connect($userserver, $username, $password, $dbname);
if(!$conn){      // 確認連線 是否成功
    die("連線失敗!".mysqli_connect_error());
}

    //人口 血型 分布
    $sql = "SELECT count(BloodType) as countBloodType, BloodType FROM member GROUP BY BloodType ORDER BY BloodType"; 
    $result = mysqli_query($conn, $sql);
    $mydataBloodType = array();
    while($row = mysqli_fetch_assoc($result)){
        $mydataBloodType[] = $row;
    }

    //人口 生肖 分布
    $sql = "SELECT count(ChineseZodiac) as countChineseZodiac, ChineseZodiac FROM member GROUP BY ChineseZodiac ORDER BY ChineseZodiac"; 
    $result = mysqli_query($conn, $sql);
    $mydataChineseZodiac = array();
    while($row = mysqli_fetch_assoc($result)){
        $mydataChineseZodiac[] = $row;
    }

    //人口 星座 分布
    $sql = "SELECT count(Constrllation) as countConstrllation, Constrllation FROM member GROUP BY Constrllation ORDER BY Constrllation"; 
    $result = mysqli_query($conn, $sql);
    $mydataConstrllation = array();
    while($row = mysqli_fetch_assoc($result)){
        $mydataConstrllation[] = $row;
    }

if(mysqli_num_rows($result) > 0){
    echo '{"state": true, "dataBloodType":'.json_encode($mydataBloodType).', "dataChineseZodiac":'.json_encode($mydataChineseZodiac).', "dataConstrllation":'.json_encode($mydataConstrllation).',"message": "會員 血型、生肖、星座 分布資料 查詢成功！"}';
}else{
    echo '{"state": false, "message": "查無資料 !"}';
}

// echo json_encode($updatedData);

mysqli_close($conn); // 抓完資料 要把 程式 關起來
