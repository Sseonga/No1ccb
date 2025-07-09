# No1ccb
ecospot


Frontend 소스트리 기본

📁 /src/components

├── 📁 common
│   ├── AppLayout.js                  ─ 전체 페이지 레이아웃 프레임 (로고, 사이드바, 본문 등)
│   ├── Sidebar.js                    ─ 왼쪽 고정 네비게이션 메뉴
│   ├── GoToMyPageButton.js          ─ 마이페이지로 이동 버튼/링크
│   ├── LogoutButton.js              ─ 로그아웃 실행 버튼
│   └── ProfileBadge.js              ─ 닉네임, 프로필, 레벨 등 사용자 뱃지 UI

├── 📁 station   (지도 / 충전소 관련)
│   ├── Tmap.js                       ─ 메인 지도 영역 (Tmap API)
│   ├── FilterPanel.js               ─ 충전방법/주차장/브랜드 필터 UI
│   ├── StationListPanel.js          ─ 충전소 리스트 전체 패널 (지도 옆)
│   ├── StationListCard.js           ─ 개별 충전소 카드 (이름, 위치 등)
│   ├── StationDetailPanel.js        ─ 충전소 상세 정보 패널
│   ├── FavoriteButton.js            ─ 충전소 즐겨찾기 토글 버튼 (별)
│   ├── ChargerList.js               ─ 충전기 상태 및 정보 리스트
│   └── ReviewLinkButton.js          ─ 리뷰 보기로 이동 버튼

├── 📁 Spot   (주변 편의시설/식당/카페)
│   ├── RestSpotPanel.js             ─ 주변 식당/카페 리스트 패널
│   ├── RestSpotCard.js              ─ 개별 식당/카페 카드 (썸네일 등)
│   └── RestSpotFilter.js            ─ 식당/카페 필터 옵션

├── 📁 review
│   ├── ReviewPanel.js               ─ 리뷰 전체 리스트 패널
│   ├── ReviewCard.js                ─ 개별 리뷰 카드 (작성자, 별점 등)
│   ├── WriteReviewLink.js           ─ 리뷰 작성 페이지 이동 버튼
│   ├── WriteReviewPanel.js          ─ 리뷰 작성 전체 폼
│   ├── ReviewTextInput.js           ─ 리뷰 텍스트 입력창
│   ├── StarRatingInput.js           ─ 별점 입력 UI
│   ├── SubmitReviewButton.js        ─ 리뷰 등록 버튼
│   ├── MyReviewListPanel.js         ─ 내가 쓴 리뷰 전체 패널
│   ├── MyReviewCard.js              ─ 내 리뷰 개별 카드
│   └── ReviewStarDisplay.js         ─ 별점 표시 전용 UI

├── 📁 route   (길찾기/경로 찾기)
│   ├── RouteSearchPanel.js          ─ 길찾기 기능 전체 패널
│   ├── RouteInputBox.js             ─ 출발지/도착지 입력창
│   ├── RouteOptionSelector.js       ─ 경로 옵션 (도보/차량 등)
│   ├── RouteResultList.js           ─ 길찾기 결과 리스트
│   ├── RouteResultItem.js           ─ 개별 경로 카드 (거리, 시간 등)
│   ├── RoutePathLine.js             ─ 지도 위 경로 라인 표시
│   └── RoutePointMarker.js          ─ 지도 마커 (출발/도착지 등)

├── 📁 accommodation   (충전소 기반 숙소)
│   ├── AccommodationPanel.js        ─ 숙소 전체 리스트 패널
│   ├── AccommodationCard.js         ─ 개별 숙소 카드
│   ├── AccommodationDetailPanel.js  ─ 숙소 상세 정보 패널
│   ├── AccommodationFavoriteButton.js ─ 숙소 즐겨찾기 버튼 (별)
│   ├── AccommodationAddForm.js      ─ [Admin] 숙소 추가 폼
│   ├── AccommodationImageInput.js   ─ [Admin] 숙소 이미지 업로드
│   └── AccommodationSaveButton.js   ─ [Admin] 숙소 저장 버튼

├── 📁 user   (회원/마이페이지 관련)
│   ├── AuthTabMenu.js               ─ 로그인/회원가입/비밀번호 찾기 탭
│   ├── LoginForm.js                 ─ 로그인 입력 폼
│   ├── JoinForm.js                  ─ 회원가입 입력 폼
│   ├── FindPasswordForm.js          ─ 비밀번호 찾기 입력 폼
│   ├── PasswordChangeForm.js        ─ 비밀번호 변경 입력창
│   ├── PasswordChangeButton.js      ─ 비밀번호 변경 완료 버튼
│   ├── FavoriteListPanel.js         ─ 마이페이지 즐겨찾기 리스트
│   ├── FavoriteItemCard.js          ─ 즐겨찾기 개별 항목 카드
│   ├── FavoriteStarButton.js        ─ 즐겨찾기 on/off 토글 버튼
│   └── MyPageTabMenu.js             ─ 마이페이지 내 탭 메뉴

├── 📁 intro   (서비스 소개/인트로)
│   ├── IntroPanel.js                ─ 서비스 소개 페이지 전체 프레임
│   ├── IntroImage.js                ─ 대표 이미지/일러스트 영역
│   └── IntroFeatureList.js          ─ 서비스 주요 기능 소개 리스트

└── 📁 admin   (관리자 전용)
    ├── AdminMenuSidebar.js          ─ 관리자 페이지 사이드 메뉴
    ├── ReportReviewTable.js         ─ 리뷰/신고 관리 테이블 전체
    ├── ReportReviewRow.js           ─ 리뷰/신고 개별 행
    ├── ReportSelectCheckbox.js      ─ 신고 행 체크박스
    ├── DeleteSelectedReportsButton.js ─ 리뷰 신고 일괄 삭제 버튼
    ├── UserManageTable.js           ─ 회원 관리 테이블 전체
    ├── UserManageRow.js             ─ 회원 개별 행 (이메일 등)
    ├── UserSelectCheckbox.js        ─ 회원 행 선택 체크박스
    └── DeleteSelectedUsersButton.js ─ 선택 회원 일괄 삭제 버튼
