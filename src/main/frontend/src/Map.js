/* global kakao */
import React, {useEffect} from "react";
import "./index.css"
//import cn from "classnames";
//import "../styles/Map.scss";

const {kakao} = window;

const Map = () => {
    const [isAtive, setIsAtive] = useState(false)
    const [isVisible, setIsVisible] = useState(false)
    const mapRef = useRef()
    const roadviewRef = useRef()

    const [center, setCenter] = useState({
        lat: 33.450422139819736,
        lng: 126.5709139924533,
    })

    useEffect(() => {
        const map = mapRef.current
        const roadview = roadviewRef.current
        if (roadview && map) {
            roadview.relayout()
            map.relayout()
            map.setCenter(new kakao.maps.LatLng(center.lat, center.lng))
        }
    }, [isVisible, center, isAtive])
    return (
        <div id="rvbx" className={"rvbx"}>
            {/* <div id="map" style={{width:"500px", height:"400px"}}></div>*/}
            <div id="mapWrapper" className={"mapWrapper"}>
                <div id="map" className={"mapContainer"}></div>
                <div id="roadviewControl" ></div>
            </div>

            <div id ="rvContainer" className={"rvContainer"}>
                <div id="roadview" className={"roadViewContainer"}></div>
                <div id="close" title="로드뷰닫기" ><span className="img"></span></div>
            </div>


        </div>
    );
};

export default Map;