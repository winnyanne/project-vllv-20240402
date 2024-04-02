<?php
    //input: {"Username":"XXX", "Password":"XXX", "Email":"XXX", "BloodType":"XXX", "ChineseZodiac":"XXX", "Constrllation":"XXX"}
    // {"state" : true, "message" : "註冊成功!"}
    // {"state" : false, "message" : "註冊失敗!"}
    // {"state" : false, "message" : "傳遞參數格式錯誤!"}       
    // {"state" : false, "message" : "未傳遞任何參數!"}

    $data = file_get_contents("php://input", "r");
    if ($data != "") {
        $mydata = array();
        $mydata = json_decode($data, true);

        if (isset($mydata["Username"]) && isset($mydata["Password"]) && isset($mydata["Email"]) && isset($mydata["BloodType"]) && isset($mydata["ChineseZodiac"]) && isset($mydata["Constrllation"]) && $mydata["Username"] != "" && $mydata["Password"] != "" && $mydata["Email"] != "" && $mydata["BloodType"] != "" && $mydata["ChineseZodiac"] != "" && $mydata["Constrllation"] != "") {
            $p_Username = $mydata["Username"];
            // 密碼加密
            $p_Password = password_hash($mydata["Password"], PASSWORD_DEFAULT);
            // echo "密碼";
            // echo $p_Password;
            // $p_Password = $mydata["Password"];
            $p_Email = $mydata["Email"];
            $p_BloodType = $mydata["BloodType"];
            $p_ChineseZodiac = $mydata["ChineseZodiac"];
            $p_Constrllation = $mydata["Constrllation"];
            $servername = "localhost";
            $username = "owner01";
            $password = "123456";
            $dbname = "vllvDB";
            // 先宣告要使用的資料庫，然後檢查連線是否成功
            $conn = mysqli_connect($servername, $username, $password, $dbname);
            if (!$conn) {
                die("連線失敗" . mysqli_connect_error());
            }

            $sql = "INSERT INTO member(Username, Password, Email, BloodType, ChineseZodiac, Constrllation, UID01) VALUES('$p_Username', '$p_Password', '$p_Email', '$p_BloodType', '$p_ChineseZodiac', '$p_Constrllation', '')";
            if (mysqli_query($conn, $sql)) {
                // 新增成功
                echo '{"state" : true, "message" : "註冊成功!"}';
            } else {
                // 新增失敗
                echo '{"state" : false, "message" : "註冊失敗！http://192.168.10.68/11301/0310/member-Create-api.php：'.$sql.'"}';
            }
            mysqli_close($conn);
        } else {
            echo '{"state" : false, "message" : "傳遞參數格式錯誤!"}';
        }
    } else {
        echo '{"state" : false, "message" : "未傳遞任何參數!"}';
    }
?>