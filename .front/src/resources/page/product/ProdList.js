import { useEffect, useState } from "react";
import "../../css/product/ProdList.css";
import ProdDetail from "../../modal/ProdDetail";
import axios from "axios";
import { useParams } from "react-router-dom";

/** 상품 리스트 페이지 */
export default function ProdList() {
	
	const [prodList, setProdList] = useState([]);
	const [showDetail, setShowDetail] = useState(false);
	const [product, setProduct] = useState();
	const {cateSub} = useParams();

	useEffect(() => {
		// 상품 리스트 불러오기
		axios.get("/product/list/" + cateSub)
		.then((result) => {
			setProdList(result.data);
			console.log(result.data);
		}).catch(console.log);
	}, []);
	
	/**
	 * 상세페이지에 필요한 값 세팅
	 * @param {number} prodNo
	 */
	function gotoProdDetail(prodNo) {
		setProduct(prodList.find((prod) => prod?.prodNo === prodNo));
		setShowDetail(true);
	}

	// console.log("test", prodList.sort((a, b) => a.price - b.price));

	/**
	 * 상품별 색상 종류 표시
	 * @returns 사진 중 중복 색상을 제거한 후 남은 단일한 색상을 반환
	 */
	function colorList(prod) {
		let arr:Set<number> = new Set(prod.detail.map((dtl) => dtl.colorNo));
		let imgList = [];

		for (let i = 0; i < prod.image.length; i++) {
			let img = prod.image[i];
			if(arr.has(img.colorNo)) {
				imgList.push(img);
				arr.delete(img.colorNo);
			}
			if(!arr.size) break;
		}

		return (
			imgList.map((img) => {
				let {imgNo, refNo, rgb} = img;
				return (<span onMouseEnter={(e) => test(e, refNo)} style={{backgroundColor: rgb, color: rgb}}>{imgNo}</span>);
			})
		);
	}
	
	/**
	 * 색깔에 커서 올리면 해당 색깔의 상품 이미지가 나오게 하는 함수
	 * @param {SyntheticBaseEvent} e 
	 */
	/**
	 * 
	 * @param {*} e 이벤트 객체
	 * @param {*} prodNo 해당 상품 번호
	 */
	function test(e, prodNo) {
		const imgNo = e.target.innerHTML;

		console.log(e.target);
		// console.log(prodList[prodNo]?.image?.find((img) => {img.imgNo === imgNo}));
	}

	

	return(<>
		<div className="ProdList">
			<div className="menu-side-area">
				<h1>메뉴영역?</h1>
			</div>
			<div className="products">
				{prodList?.length ? prodList.map((prod) => {
					return(<>
						<section key={prod.prodNo} className="product" onClick={() => gotoProdDetail(prod.prodNo)}>
							{/* 썸넬 사진을 찾아서 보여주기 */}
							<img src={prod?.image?.find((img) => img.imgType === 1)?.imgName} alt={prod.prodName} className="prod-img" />
							<article>
								{/* 이름이 가격 위에 있는게 좋을거같아서 올렸는데 맘에 안들면 내려 */}
								{/* 그리고 이름이 박스 사이즈 넘어가는 길이면 "페이크 레더 스탠드 카라 지퍼 바이커 자켓..." 으로 보이게 바꿨음 */}
								<div className="prod-name">{prod.prodName}</div>
								{/* 할인이 없는 상품은 price만 나와야 하고, 할인이 있는 상품은 price, discountRate 두개가 나와야함 */}
								{/* 가격에 3자리수 마다 "," 찍어주는거 해야함 */}
							<div className="prod-amount">
								<div>\{prod.price - (prod.price * (prod.discountRate / 100))}</div>
								<div>\{prod.price}</div>
							</div>
								<div className="prod-color">
									{prod.image?.length && colorList(prod)}
								</div>
							</article>
						</section>
					</>);
				}) : <>
					<div style={{padding: "50px"}}>
						<h1>검색된 상품이 없습니다</h1>
					</div>
				</> }
			</div>
		</div>

	 	{product && <ProdDetail showDetail={showDetail} setShowDetail={setShowDetail} product={product} />}
	</>);
}