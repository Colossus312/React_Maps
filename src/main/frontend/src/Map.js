/* global kakao */
import React, {useEffect, useState ,useRef}  from "react";
import {CustomOverlayMap, Roadview, MapTypeId, Map, MapMarker} from "react-kakao-maps-sdk"
import "./index.css"

const KakaoMap = () => {
    const [isAtive, setIsAtive] = useState(false)
    const [isVisible, setIsVisible] = useState(false)
    const mapRef = useRef()
    const roadviewRef = useRef()

    const [pan, setPan] = useState(0)

    const [center, setCenter] = useState({
        lat: 33.450422139819736,
        lng: 126.5709139924533,
    })

    const getAngleClassName = (angle) => {
        const threshold = 22.5 //이미지가 변화되어야 되는(각도가 변해야되는) 임계 값
        for (var i = 0; i < 16; i++) {
            //각도에 따라 변화되는 앵글 이미지의 수가 16개
            if (angle > threshold * i && angle < threshold * (i + 1)) {
                //각도(pan)에 따라 아이콘의 class명을 변경
                return "m" + i
            }
        }
    }

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
        <div style={{ display: "flex", position: "relative", width: "100%", height: "100%" }}>

            <Map // 로드뷰를 표시할 Container
                center={center}
                style={{
                    // 지도의 크기
                    width: !isVisible ? "100%" : "50%",
                    height: "100vh",
                }}
                level={3}
                ref={mapRef}
            >
                {isAtive && (
                    <>
                        <MapTypeId type={kakao.maps.MapTypeId.ROADVIEW} />
                        {/*<MapMarker
                            position={center}
                            draggable={true}
                            onDragEnd={(marker) => {
                                setCenter({
                                    lat: marker.getPosition().getLat(),
                                    lng: marker.getPosition().getLng(),
                                })
                            }}
                            image={{
                                src: "https://t1.daumcdn.net/localimg/localimages/07/2018/pc/roadview_minimap_wk_2018.png",
                                size: { width: 26, height: 46 },
                                options: {
                                    spriteSize: { width: 1666, height: 168 },
                                    spriteOrigin: { x: 705, y: 114 },
                                    offset: { x: 13, y: 46 },
                                },
                            }}
                        />*/}
                        <CustomOverlayMap
                            position={center}
                            yAnchor={1}
                        >
                            <div className={`MapWalker ${getAngleClassName(pan)}`}>
                                <div className={`angleBack`}></div>
                                <div className={"figure"}></div>
                            </div>
                        </CustomOverlayMap>
                    </>
                )}
            </Map>
            <div
                id="roadviewControl"
                className={isAtive ? "active" : ""}
                onClick={() => {
                    setIsVisible(true)
                    setIsAtive(!isAtive)
                }}
            >
                <span className="img"></span>
            </div>
            <div
                style={{
                    position: "relative",
                    width: isVisible ? "50%" : "0",
                    overflow: "hidden"
                }}
            >
                <Roadview // 로드뷰를 표시할 Container
                    position={{ ...center, radius: 50 }}
                    style={{
                        // 지도의 크기
                        width: "100%",
                        height: "100vh",
                    }}
                    pan={pan}
                    onViewpointChange={(roadview) => setPan(roadview.getViewpoint().pan)}
                    onPositionChanged={(rv) => {
                        setCenter({
                            lat: rv.getPosition().getLat(),
                            lng: rv.getPosition().getLng(),
                        })
                    }}
                    onPanoidChange={() => {
                        isAtive && setIsVisible(true)
                    }}
                    onErrorGetNearestPanoId={() => {
                        setIsVisible(false)
                    }}
                    ref={roadviewRef}
                >
                    <div
                        id="close"
                        title="로드뷰닫기"
                        onClick={() => setIsVisible(false)}
                    >
                        <span className="img"></span>
                    </div>
                </Roadview>
            </div>
        </div>
    );
};

export default KakaoMap;