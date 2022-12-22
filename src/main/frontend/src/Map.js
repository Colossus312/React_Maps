/* global kakao */
import React, {useEffect, useState ,useRef,useCallback}  from "react";
import {CustomOverlayMap, Roadview, MapTypeId, Map } from "react-kakao-maps-sdk"
import "./index.css"

const KakaoMap = () => {
    const startPoint = useRef({ x: 0, y: 0 })
    const overlayPoint = useRef()
    const [position, setPosition] = useState({
        lat: 33.450422139819736,
        lng: 126.5709139924533,
    })
    let overlayFlag = false;
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
    const onMouseMove = useCallback(
        (e) => {
            // 이벤트 버블링 현상이 발생하지 않도록 방지 합니다.
            e.preventDefault()
            const map = mapRef.current
            overlayFlag = true;
            const proj = map.getProjection() // 지도 객체로 부터 화면픽셀좌표, 지도좌표간 변환을 위한 MapProjection 객체를 얻어옵니다
            const deltaX = startPoint.current.x - e.clientX // mousedown한 픽셀좌표에서 mousemove한 좌표를 빼서 실제로 마우스가 이동된 픽셀좌표를 구합니다
            const deltaY = startPoint.current.y - e.clientY
            // mousedown됐을 때의 커스텀 오버레이의 좌표에 실제로 마우스가 이동된 픽셀좌표를 반영합니다
            const newPoint = new kakao.maps.Point(
                overlayPoint.current.x - deltaX,
                overlayPoint.current.y - deltaY
            )
            // 계산된 픽셀 좌표를 지도 컨테이너에 해당하는 지도 좌표로 변경합니다
            const newPos = proj.coordsFromContainerPoint(newPoint);

            // 커스텀 오버레이의 좌표를 설정합니다
            setPosition({
                lat: newPos.getLat(),
                lng: newPos.getLng(),
            })
        },
        []
    )

    const onMouseUp = useCallback((e) => {
        // MouseUp 이벤트 발생시 기존 mousemove 이벤트를 제거 합니다.
        if(overlayFlag){
            const map = mapRef.current

            const roadview = roadviewRef.current

            const proj = map.getProjection()

            kakao.maps.event.preventMap()

            const deltaX = startPoint.current.x - e.clientX // mousedown한 픽셀좌표에서 mousemove한 좌표를 빼서 실제로 마우스가 이동된 픽셀좌표를 구합니다
            const deltaY = startPoint.current.y - e.clientY
            // mousedown됐을 때의 커스텀 오버레이의 좌표에 실제로 마우스가 이동된 픽셀좌표를 반영합니다
            const newPoint = new kakao.maps.Point(
                overlayPoint.current.x - deltaX,
                overlayPoint.current.y - deltaY
            )
            // 계산된 픽셀 좌표를 지도 컨테이너에 해당하는 지도 좌표로 변경합니다
            const newPos = proj.coordsFromContainerPoint(newPoint);


            // 커스텀 오버레이의 좌표를 설정합니다
            setCenter({
                lat: newPos.getLat(),
                lng: newPos.getLng(),
            })

            overlayFlag = false;

        }else{

        }


        document.removeEventListener("mousemove", onMouseMove)
    }, [onMouseMove])

    const onMouseDown = useCallback(
        (e) => {
            // 이벤트 버블링 현상이 발생하지 않도록 방지 합니다.
            e.preventDefault()

            const map = mapRef.current

            const roadview = roadviewRef.current

            const proj = map.getProjection()

            kakao.maps.event.preventMap()

            startPoint.current.x = e.clientX
            startPoint.current.y = e.clientY

            overlayPoint.current = proj.containerPointFromCoords(
                new kakao.maps.LatLng(position.lat, position.lng)
            )

            document.addEventListener("mousemove", onMouseMove)
        },
        [onMouseMove, position.lat, position.lng]
    )
    useEffect(() => {
        const map = mapRef.current
        const roadview = roadviewRef.current
        if (roadview && map) {
            roadview.relayout()
            map.relayout()
            map.setCenter(new kakao.maps.LatLng(center.lat, center.lng))
        }
        document.addEventListener("mouseup", onMouseUp)

        return () => {
            document.removeEventListener("mouseup", onMouseUp)
        }
    }, [onMouseUp, onMouseDown, isVisible, center, isAtive])
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
                            position={position}
                            yAnchor={1}
                        >
                            <div onMouseDown={onMouseDown} className={`MapWalker ${getAngleClassName(pan)}`}>
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
                        setPosition({
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