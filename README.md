# voronoi-safety-zone

보로노이 다이어그램을 활용한 연애 안전지대 구성 탐구를 통해

실제로 구현된 웹사이트입니다.

여러명의 이성친구의 주소가 주어질 때 어떤 범위에서 데이트하면 안전한지 제안하는 재미있는 프로젝트입니다. ^^

## 원리

주소를 입력하면 daum 지도 api를 통해 gps 위치를 얻고

여러 gps 위치를 기준으로 voronoi diagram 을 그립니다.

## 기술

다음과 같은 기술들을 사용했습니다.

- 외부 api 연동
- canvas drawing
- 지도 이미지와 gps 좌표 매핑 (연립방정식)

voronoi diagram 자체는 외부 라이브러리를 사용했습니다.

<img width="585" alt="safetyzone" src="https://user-images.githubusercontent.com/73598874/228432504-f4e217e5-161d-4074-a1f4-3052a8be83c7.png">
