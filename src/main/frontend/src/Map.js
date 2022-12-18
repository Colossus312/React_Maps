/* global kakao */
import React, {useEffect} from "react";
import "./index.css"
//import cn from "classnames";
//import "../styles/Map.scss";

const {kakao} = window;

const Map = () => {
    useEffect(() => {


        let startX, startY, startOverlayPoint;
        // 동동이 마커 관련 함수
        function MapWalker(position) {

            // 커스텀 오버레이에 사용할 map walker 엘리먼트
            const content = document.createElement('div')
            const figure = document.createElement('div')
            const angleBack = document.createElement('div')

            // map walker를 구성하는 각 노드들의 class명을 지정 - style셋팅을 위해 필요
            content.className = 'MapWalker'
            figure.className = 'figure'
            angleBack.className = 'angleBack'

            content.appendChild(angleBack)
            content.appendChild(figure)

            // 커스텀 오버레이 객체를 사용하여, map walker 아이콘을 생성
            const walker = new kakao.maps.CustomOverlay({
                position: position,
                content: content,
                yAnchor: 1
            })

            this.walker = walker
            this.content = content

            // 커스텀 오버레이에 mousedown이벤트를 등록합니다
            addEventHandle(this.content, 'mousedown', onMouseDown);

            // 커스텀 오버레이에 mouseup이벤트를 등록합니다.
            addEventHandle(this.content, 'mouseup', onMouseUp);
        }


        function onMouseDown(e) {
            // 커스텀 오버레이를 드래그 할 때, 내부 텍스트가 영역 선택되는 현상을 막아줍니다.
            if (e.preventDefault) {
                e.preventDefault();
            } else {
                e.returnValue = false;
            }

            var proj = map.getProjection(),
                overlayPos = mapWalker.getPosition(); // 커스텀 오버레이의 현재 위치를 가져옵니다

            // 커스텀오버레이에서 마우스 관련 이벤트가 발생해도 지도가 움직이지 않도록 합니다
            kakao.maps.event.preventMap();

            if (e.type == 'mousedown') {
                startX = e.clientX;
                startY = e.clientY;
            }

            // mousedown됐을 때의 커스텀 오버레이의 좌표를
            // 지도 컨테이너내 픽셀 좌표로 변환합니다
            startOverlayPoint = proj.containerPointFromCoords(overlayPos);

            // document에 mousemove 이벤트를 등록합니다
            addEventHandle(document, 'mousemove', onMouseMove);
        }

        function onMouseMove(e) {
            // 커스텀 오버레이를 드래그 할 때, 내부 텍스트가 영역 선택되는 현상을 막아줍니다.
            if (e.preventDefault) {
                e.preventDefault();
            } else {
                e.returnValue = false;
            }

            if (e.type == 'mousemove') {
                var proj = map.getProjection(),// 지도 객체로 부터 화면픽셀좌표, 지도좌표간 변환을 위한 MapProjection 객체를 얻어옵니다
                    deltaX = startX - e.clientX, // mousedown한 픽셀좌표에서 mousemove한 좌표를 빼서 실제로 마우스가 이동된 픽셀좌표를 구합니다
                    deltaY = startY - e.clientY,
                    // mousedown됐을 때의 커스텀 오버레이의 좌표에 실제로 마우스가 이동된 픽셀좌표를 반영합니다
                    newPoint = new kakao.maps.Point(startOverlayPoint.x - deltaX, startOverlayPoint.y - deltaY),
                    // 계산된 픽셀 좌표를 지도 컨테이너에 해당하는 지도 좌표로 변경합니다
                    newPos = proj.coordsFromContainerPoint(newPoint);
            }
            // 커스텀 오버레이의 좌표를 설정합니다
            mapWalker.setPosition(newPos);
        }

// mouseup 했을 때 호출되는 핸들러 입니다
        function onMouseUp(e) {
            // 등록된 mousemove 이벤트 핸들러를 제거합니다
            removeEventHandle(document, 'mousemove', onMouseMove);
            //이동한 마커 위치의 panoId를 가져올 수 있도록 toggleRoadview를 호출합니다.
            toggleRoadview(mapWalker.getPosition());
        }

// target node에 이벤트 핸들러를 등록하는 함수힙니다
        function addEventHandle(target, type, callback) {
            if (target.addEventListener) {
                target.addEventListener(type, callback);
            } else {
                target.attachEvent('on' + type, callback);
            }
        }

// target node에 등록된 이벤트 핸들러를 제거하는 함수힙니다
        function removeEventHandle(target, type, callback) {
            if (target.removeEventListener) {
                target.removeEventListener(type, callback);
            } else {
                target.detachEvent('on' + type, callback);
            }
        }

        MapWalker.prototype.getPosition = function () {
            return this.walker.getPosition();
        }


// 로드뷰의 pan(좌우 각도)값에 따라 map walker의 백그라운드 이미지를 변경 시키는 함수
// background로 사용할 sprite 이미지에 따라 계산 식은 달라 질 수 있음
        MapWalker.prototype.setAngle = function (angle) {

            const threshold = 22.5 	 // 이미지가 변화되어야 되는(각도가 변해야되는) 임계 값
            const imgCount = 16
            for (let i = 0; i < imgCount; i++) { // 각도에 따라 변화되는 앵글 이미지의 수가 16개
                if (angle > (threshold * i) && angle < (threshold * (i + 1))) {

                    // 각도(pan)에 따라 아이콘의 class명을 변경
                    let className = 'm' + i
                    this.content.className = this.content.className.split(' ')[0]
                    this.content.className += (' ' + className)
                    break
                }
            }
        }

// map walker의 위치를 변경시키는 함수
        MapWalker.prototype.setPosition = function (position) {
            this.walker.setPosition(position)
        }

// map walker를 지도위에 올리는 함수
        MapWalker.prototype.setMap = function (map) {
            this.walker.setMap(map)
        }

        //clickPoint = new kakao.maps.LatLng(36.1358642, 128.0785804) // 버그 방지용 좌표 초기값 선언

        let overlayOn = false, // 지도 위에 로드뷰 오버레이가 추가된 상태를 가지고 있을 변수
            container = document.getElementById('rvbx'), // 지도와 로드뷰를 감싸고 있는 div
            mapWrapper = document.getElementById('mapWrapper'), // 지도를 감싸고 있는 div
            mapContainer = document.getElementById('map'), // 지도를 표시할 div
            rvContainer = document.getElementById('roadview') //로드뷰를 표시할 div

        let mapCenter = new kakao.maps.LatLng(35.5396224, 129.3115276), // 지도의 중심좌표
            mapOption = {
                center: mapCenter, // 지도의 중심좌표
                level: 3 // 지도의 확대 레벨
            }

        // 지도를 표시할 div와 지도 옵션으로 지도를 생성
        const map = new kakao.maps.Map(mapContainer, mapOption)
        map.addOverlayMapTypeId(kakao.maps.MapTypeId.ROADVIEW)
        // 로드뷰 객체를 생성
        const rv = new kakao.maps.Roadview(rvContainer)

        // 좌표로부터 로드뷰 파노라마 ID를 가져올 로드뷰 클라이언트 객체를 생성
        const rvClient = new kakao.maps.RoadviewClient()
        let position = new kakao.maps.LatLng(33.450701, 126.570667);
        rvClient.getNearestPanoId(position, 50, function(panoId) {
            rv.setPanoId(panoId, position); //panoId와 중심좌표를 통해 로드뷰 실행
        });
        // 동동이 초기화
        let mapWalker = null

        // 로드뷰 초기화 이벤트
        kakao.maps.event.addListener(rv, 'init', () => {


            mapWalker = new MapWalker(mapCenter)
            mapWalker.setMap(map) // map walker를 지도에 설정
            kakao.maps.event.addListener(rv, 'viewpoint_changed', () => {

                // 이벤트가 발생할 때마다 로드뷰의 viewpoint값을 읽어, map walker에 반영
                let viewpoint = rv.getViewpoint()
                mapWalker.setAngle(viewpoint.pan)

            })

            // 로드뷰에 좌표가 바뀌었을 때 발생하는 이벤트를 등록
            kakao.maps.event.addListener(rv, 'position_changed', () => {

                // 현재 로드뷰의 위치 좌표를 얻어옴
                let rvPosition = rv.getPosition()

                // console.log(rv.getPosition().La)

                // 마커가 이미 존재할경우 삭제
                /*if (lMarker2 != undefined) {
                    map.removeLayer(lMarker2)
                    /!* map.removeLayer(lMarker1) *!/
                }*/


                // 지도의 중심과 동동이를 현재 로드뷰의 위치로 설정
                map.setCenter(rvPosition)
                mapWalker.setPosition(rvPosition)

                // 로드뷰 마커 설정
                //lMarker2 = new L.Marker([rvmap.getCenter().getLat(), rvmap.getCenter().getLng()], {icon: greenIcon}).addTo(map)

                // leaflet 지도 시점 설정
                //map.setView([rv.getPosition().Ma, rv.getPosition().La])

                // 지도 위에 로드뷰 도로 오버레이가 추가된 상태이면
                if (overlayOn == true) {

                    // 마커의 위치를 현재 로드뷰의 위치로 설정
                    mapWalker.setPosition(rvPosition)
                    //marker.setPosition(rvPosition)
                }
            })
        })


        // kakao 지도 클릭 이벤트
        kakao.maps.event.addListener(map, 'click', (mouseEvent) => {

            // 지도 위에 로드뷰 도로 오버레이가 추가된 상태가 아니면 클릭이벤트를 무시
            if (overlayOn == false) {
                return
            }
            // 클릭한 위치의 좌표
            let position = mouseEvent.latLng

            // 마커를 클릭한 위치로 옮김
            //marker.setPosition(position)
            mapWalker.setPosition(position)

            // 클락한 위치를 기준으로 로드뷰를 설정
            toggleRoadview(position)
        })

// 전달받은 좌표(position)에 가까운 로드뷰의 파노라마 ID를 추출하여
// 로드뷰를 설정하는 함수
        const toggleRoadview = (position) => {
            rvClient.getNearestPanoId(position, 50, (panoId) => {
                // 파노라마 ID가 null 이면 로드뷰를 숨김
                if (panoId === null) {
                    toggleMapWrapper(true, position)
                    // 마커가 이미 존재할경우 삭제
                    /*if (lMarker2 != undefined) {
                        map.removeLayer(lMarker2)
                    }*/
                    // 로드뷰 마커 설정
                    //lMarker2 = new L.Marker([rvmap.getCenter().getLat(), rvmap.getCenter().getLng()], {icon: greenIcon}).addTo(map)

                    //leaflet 지도 시점 설정
                    //.setView([rvmap.getCenter().getLat(), rvmap.getCenter().getLng()])

                    //로드뷰가 없어도 마커 이동
                    mapWalker.setPosition(position)
                } else {
                    toggleMapWrapper(false, position)

                    // panoId로 로드뷰를 설정
                    rv.setPanoId(panoId, position)
                }
            })
        }
// 지도를 감싸고 있는 div의 크기를 조정하는 함수
        const toggleMapWrapper = (active, position) => {
            if (active) {

                // 지도를 감싸고 있는 div의 너비가 100%가 되도록 class를 변경
                //container.className = 'mapContainer'

                // 지도의 크기가 변경되었기 때문에 relayout 함수를 호출
                map.relayout()

                // 지도의 너비가 변경될 때 지도중심을 입력받은 위치(position)로 설정
                map.setCenter(position)
            } else {

                // 지도만 보여지고 있는 상태이면 지도의 너비가 50%가 되도록 class를 변경하여
                // 로드뷰가 함께 표시되게 함
                if (container.className.indexOf('mapContainer') === -1) {
                    //container.className = 'roadViewContainer'

                    // 지도의 크기가 변경되었기 때문에 relayout 함수를 호출
                    map.relayout()

                    // 지도의 너비가 변경될 때 지도중심을 입력받은 위치(position)로 설정
                    map.setCenter(position)
                }
            }
        }

// 지도 위의 로드뷰 도로 오버레이를 추가,제거하는 함수
        const toggleOverlay = (active) => {
            if (active) {

                //오버레이 켜짐 식별자
                overlayOn = true

                // 지도 위에 로드뷰 도로 오버레이를 추가
                map.addOverlayMapTypeId(kakao.maps.MapTypeId.ROADVIEW)


                // 로드뷰의 위치를 지도 중심으로 설정
                toggleRoadview(map.getCenter())

                // 마커를 맵워커로 대체
                mapWalker.setMap(map)
                mapWalker.setPosition(map.getCenter())
            } else {
                overlayOn = false

                // 지도 위의 로드뷰 도로 오버레이를 제거합니다
                map.removeOverlayMapTypeId(kakao.maps.MapTypeId.ROADVIEW)

                // 지도 위의 마커를 제거합니다
                mapWalker.setMap(null)
            }
        }

// 지도 위의 로드뷰 버튼을 눌렀을 때 호출되는 함수
        const setRoadviewRoad = () => {
            const control = document.getElementById('roadviewControl')

            // 버튼이 눌린 상태가 아니면
            if (control.className.indexOf('active') === -1) {
                control.className = 'active'

                // 로드뷰 도로 오버레이가 보이게
                toggleOverlay(true)
            } else {
                control.className = ''

                // 로드뷰 도로 오버레이를 제거
                toggleOverlay(false)
            }
        }

        // 로드뷰에서 X버튼을 눌렀을 때 로드뷰를 지도 뒤로 숨기는 함수
        const closeRoadview = () => {
            let position = mapWalker.getPosition()
            toggleMapWrapper(true, position)
        }



        console.log("loading kakaomap");
    }, []);

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