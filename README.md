# 가위바위보 대전 (Rock Scissors Paper)

[![Deploy](https://img.shields.io/badge/PLAY%20NOW-rock--paper--scissors.online-7c3aed?style=for-the-badge&logo=google-chrome&logoColor=white)](https://rock-paper-scissors.online)

실시간 가위바위보 대전 웹 서비스의 프론트엔드입니다.

## 주요 기능

### 실시간 대전

- WebSocket 기반 실시간 가위바위보 대전
- 대전 요청 → 대기실(로비) → 게임 진행 → 결과 확인 흐름
- 라운드별 30초 타이머, 로비 5분 대기 제한
- 대전방 링크 복사로 상대 초대 가능

### 대전 전적

- 전체/승/패/무 전적 및 승률 표시
- 대전 기록 무한 스크롤 조회
- 상대 닉네임 검색 및 결과(승/패/무) 필터링
- 비로그인 상태에서도 다른 유저의 전적 열람 가능

### 유저 프로필

- 프로필 이미지 업로드 및 상태 메시지 설정
- 마이페이지에서 내 정보, 전적, 친구, 대전 기록 한눈에 확인
- 다른 유저 프로필 페이지에서 전적 및 친구 목록 열람

### 친구

- 유저 검색을 통한 친구 요청
- 받은 요청 수락/거절, 보낸 요청 관리
- 친구 목록 검색 및 무한 스크롤

### 알림

- 대전 요청, 거절 등 실시간 알림

### 접속 상태

- 실시간 접속 상태(온라인) 표시
- 주기적 heartbeat로 세션 유지

### 인증

- Google OAuth 로그인

## 기술 스택

- **React** + **TypeScript** (Vite)
- **Tailwind CSS v4**
- **TanStack Query**
- **React Router v7**
- **Axios**
- **WebSocket**
