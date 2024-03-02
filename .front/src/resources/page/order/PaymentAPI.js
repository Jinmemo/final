import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { insertOrderAPI, selectOrderNoAPI } from "./OrderAPI";
import Cookies from "js-cookie";

export default function PaymentAPI({ userInfo, dataByPayment, changeInfo, orderProd }) {


    const navi = useNavigate();
    const [orderNo, setOrderNo] = useState(0);
    const { memberNo, memberName, address, addressDetail, email, phone, zipCode, gradeNo } = userInfo;
    // const { receiverName, phone1, phone2, phone3, address, addressDetail, zipCode } = changeInfo;
    const { applyCoupon, applyPoint, delMsg, discountPrice, totalPrice } = dataByPayment;



    useEffect(() => {
        const script1 = document.createElement("script");
        script1.src = "https://code.jquery.com/jquery-1.12.4.min.js";

        document.head.appendChild(script1);

        const script2 = document.createElement("script");
        script2.src = "https://cdn.iamport.kr/js/iamport.payment-1.2.0.js";

        document.head.appendChild(script2);

        // OrderNo Setting
        setOrderNo(getOrderNo());

        return () => {
            document.head.removeChild(script1);
            document.head.removeChild(script2);
        };
    }, []);



    const amount = dataByPayment.totalPrice - dataByPayment.discountPrice;
    const count = orderProd.length;
    let prodName = "";

    if (orderProd.length > 0) {
        prodName = Object.keys(orderProd[1]).length > 0 ? `${orderProd[0].prodName} 외 ${count - 1}` : orderProd[0].prodName;

    }
    const buyerName = changeInfo.receiverName == "" ? userInfo.memberName : changeInfo.receiverName;
    const buyerTel = (changeInfo.phone1 || changeInfo.phone2 || changeInfo.phone3) ? changeInfo.phone1 + changeInfo.phone2 + changeInfo.phone3 : userInfo.phone;
    const addr = (changeInfo.address == "") ? userInfo.address : changeInfo.address;
    const addrDetail = (changeInfo.addressDetail == "") ? userInfo.addressDetail : changeInfo.addressDetail;
    const zip = (changeInfo.zipCode == "") ? userInfo.zipCode : changeInfo.zipCode;
    const couponNo = Object.keys(applyCoupon).length > 0 ? applyCoupon.couponNo : 0;
    const payPrice = totalPrice - discountPrice;

    const insertToDb = async (insertData) => {
        const responseData = await insertOrderAPI(insertData);
    };

    const getOrderNo = async () => {
        const responseData = await selectOrderNoAPI();

        return responseData;
    };

    const getObjData = (arr, key) => {
        let responseArr = [];
        arr.map((item) => {
            if (item[key] != null) {
                responseArr.push(item[key]);
            };
        });
        return responseArr;
    }
    getObjData(JSON.parse(Cookies.get('cart')), 'index');
    // `${new Date().getFullYear()}${(new Date().getMonth() + 1 < 10 ? '0' : '')}${new Date().getMonth() + 1}${(new Date().getDate() < 10 ? '0' : '')}${new Date().getDate()}` + `on=${orderNo}`
    let orderData = {};


    const requestPay = () => {
        if (window.IMP) {
            console.log("연결중..");
            const { IMP } = window;
            IMP.init('imp05612074');



            orderData = {
                pg: 'html5_inicis',                           // PG사
                pay_method: 'card',                           // 결제수단 //가상계좌 vbank
                merchant_uid: 930,  // 주문번호
                amount: 100,                                 // 결제금액
                name: prodName,                  // 주문명
                buyer_name: userInfo.memberName,                           // 구매자 이름
                buyer_tel: buyerTel,                     // 구매자 전화번호
                buyer_email: userInfo.email,               // 구매자 이메일
                buyer_addr: addr,                    // 구매자 주소
                buyer_postcode: zip                   // 구매자 우편번호
            };
            console.log(orderData);
            /* 4. 결제 창 호출하기 */
            IMP.request_pay(orderData, callback);
        };


        function callback(response) {
            const {
                success,
                merchant_uid,
                error_msg
            } = response;


            if (success) {
                alert('결제 성공');

                const insertData = {
                    memberNo: memberNo,
                    orderName: memberName,
                    receiver: buyerName,
                    receivePhone: buyerTel,
                    address: addr,
                    addressDetail: addrDetail,
                    zipCode: zip,
                    couponNo: couponNo,
                    point: applyPoint,
                    message: delMsg,
                    totalPrice: totalPrice,
                    paymentPrice: payPrice,
                    totalCount: count,
                    index: getObjData(orderProd, 'index'),
                    prodNo: getObjData(orderProd, 'prodNo'),
                    count: getObjData(orderProd, 'count'),
                    price: getObjData(orderProd, 'price'),
                    gradeNo: gradeNo,
                };

                insertToDb(insertData);
                console.log("orderData ?", orderData);
                console.log("insertData ?", insertData);
                alert("..");
                navi('/order/payment', { state: { orderData: orderData, orderProd: orderProd } });
            } else {
                alert(`결제 실패 : ${error_msg}`);
            }
        };
    };

    // 결제하기 버튼 클릭시 
    const paymentReq = (data, e) => {

        // e.preventDefault();
        // if (!phone || !address || !addressDetail) {
        //     alert("배송정보가 모두 입력되지 않았습니다.");
        //     return;
        // }

        // const newWindew = window.open(
        //     "",
        //     "_blank",
        //     "width=500, height=500"
        // );
        console.log(data);
        console.log(orderData);


        requestPay();

    }



    return (
        <div>
            <button onClick={paymentReq}>결제하기</button>
        </div >
    );
}