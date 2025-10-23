# 🚨 자주 발생하는 에러 해결 가이드

## 📋 목차
- [Node.js 관련 에러](#nodejs-관련-에러)
- [pnpm 관련 에러](#pnpm-관련-에러)
- [PostgreSQL 관련 에러](#postgresql-관련-에러)
- [Docker 관련 에러](#docker-관련-에러)
- [TypeScript 관련 에러](#typescript-관련-에러)
- [React 관련 에러](#react-관련-에러)
- [NestJS 관련 에러](#nestjs-관련-에러)
- [Prisma 관련 에러](#prisma-관련-에러)

---

## Node.js 관련 에러

### ❌ Error: Node.js version not supported
```
Error: The engine "node" is incompatible with this module
```

**원인**: Node.js 버전이 프로젝트 요구사항과 맞지 않음

**해결방법**:
1. Node.js 버전 확인: `node --version`
2. 18.x 이상 버전 설치: [Node.js 공식 사이트](https://nodejs.org)
3. nvm 사용 시: `nvm install 18 && nvm use 18`

### ❌ Error: EACCES permission denied
```
Error: EACCES: permission denied, access '/usr/local/lib/node_modules'
```

**원인**: npm 전역 설치 권한 문제

**해결방법**:
1. sudo 사용: `sudo npm install -g pnpm`
2. 또는 npm prefix 변경: `npm config set prefix ~/.npm-global`

---

## pnpm 관련 에러

### ❌ Error: pnpm command not found
```
bash: pnpm: command not found
```

**원인**: pnpm이 설치되지 않음

**해결방법**:
1. npm으로 설치: `npm install -g pnpm`
2. 또는 corepack 사용: `corepack enable`

### ❌ Error: Workspace not found
```
Error: Cannot find workspace package
```

**원인**: pnpm-workspace.yaml 설정 문제

**해결방법**:
1. 루트 디렉토리에 `pnpm-workspace.yaml` 파일 확인
2. 파일 내용 확인:
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

---

## PostgreSQL 관련 에러

### ❌ Error: connection refused
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**원인**: PostgreSQL 서버가 실행되지 않음

**해결방법**:
1. PostgreSQL 서비스 시작:
   - Ubuntu/Debian: `sudo systemctl start postgresql`
   - macOS: `brew services start postgresql`
   - Windows: 서비스 관리자에서 시작

2. 포트 확인: `netstat -an | grep 5432`

### ❌ Error: database does not exist
```
Error: database "myblog" does not exist
```

**원인**: 데이터베이스가 생성되지 않음

**해결방법**:
1. PostgreSQL 접속: `psql -U postgres`
2. 데이터베이스 생성: `CREATE DATABASE myblog;`
3. 사용자 생성: `CREATE USER myuser WITH PASSWORD 'mypassword';`
4. 권한 부여: `GRANT ALL PRIVILEGES ON DATABASE myblog TO myuser;`

---

## Docker 관련 에러

### ❌ Error: Cannot connect to Docker daemon
```
Error: Cannot connect to the Docker daemon
```

**원인**: Docker 데몬이 실행되지 않음

**해결방법**:
1. Docker 서비스 시작:
   - Ubuntu/Debian: `sudo systemctl start docker`
   - macOS: Docker Desktop 실행
   - Windows: Docker Desktop 실행

2. 사용자 권한 확인: `sudo usermod -aG docker $USER`

### ❌ Error: Port already in use
```
Error: Port 3000 is already in use
```

**원인**: 포트가 이미 사용 중

**해결방법**:
1. 포트 사용 프로세스 확인: `lsof -i :3000`
2. 프로세스 종료: `kill -9 <PID>`
3. 또는 다른 포트 사용: `docker-compose.yml`에서 포트 변경

---

## TypeScript 관련 에러

### ❌ Error: Cannot find module
```
Error: Cannot find module './types'
```

**원인**: 모듈 경로 문제

**해결방법**:
1. 파일 경로 확인
2. tsconfig.json에서 baseUrl 설정:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### ❌ Error: Type not found
```
Error: Cannot find name 'User'
```

**원인**: 타입 정의 누락

**해결방법**:
1. 타입 정의 파일 생성
2. import 문 추가
3. @types 패키지 설치

---

## React 관련 에러

### ❌ Error: React Hook dependency warning
```
Warning: React Hook useEffect has missing dependencies
```

**원인**: useEffect 의존성 배열 누락

**해결방법**:
1. 의존성 배열에 누락된 변수 추가
2. 또는 useCallback으로 함수 메모이제이션

### ❌ Error: Cannot read property of undefined
```
TypeError: Cannot read property 'title' of undefined
```

**원인**: 객체가 undefined인 상태에서 속성 접근

**해결방법**:
1. 옵셔널 체이닝 사용: `post?.title`
2. 조건부 렌더링: `{post && <div>{post.title}</div>}`
3. 기본값 설정: `const title = post?.title || '제목 없음'`

---

## NestJS 관련 에러

### ❌ Error: Cannot resolve dependency
```
Error: Nest can't resolve dependencies
```

**원인**: 의존성 주입 설정 문제

**해결방법**:
1. 모듈에 Provider 등록 확인
2. @Injectable() 데코레이터 확인
3. 순환 의존성 확인

### ❌ Error: Validation failed
```
Error: Validation failed (uuid is expected)
```

**원인**: DTO 검증 실패

**해결방법**:
1. DTO에 ValidationPipe 적용
2. class-validator 데코레이터 확인
3. 요청 데이터 형식 확인

---

## Prisma 관련 에러

### ❌ Error: Schema validation error
```
Error: Schema validation error
```

**원인**: Prisma 스키마 문법 오류

**해결방법**:
1. 스키마 문법 확인
2. Prisma 스키마 검증: `npx prisma validate`
3. 공식 문서 참조

### ❌ Error: Migration failed
```
Error: Migration failed
```

**원인**: 마이그레이션 실행 실패

**해결방법**:
1. 데이터베이스 연결 확인
2. 마이그레이션 상태 확인: `npx prisma migrate status`
3. 마이그레이션 리셋: `npx prisma migrate reset`

---

## 🔧 일반적인 해결 방법

### 1. 캐시 클리어
```bash
# npm 캐시
npm cache clean --force

# pnpm 캐시
pnpm store prune

# Docker 캐시
docker system prune -a
```

### 2. node_modules 재설치
```bash
rm -rf node_modules
rm package-lock.json  # 또는 pnpm-lock.yaml
npm install  # 또는 pnpm install
```

### 3. 포트 확인 및 해제
```bash
# 포트 사용 프로세스 확인
lsof -i :3000
lsof -i :5432

# 프로세스 종료
kill -9 <PID>
```

### 4. 로그 확인
```bash
# Docker 로그
docker logs <container_name>

# 시스템 로그
journalctl -u postgresql
journalctl -u docker
```

---

## 📞 도움 요청 시 포함할 정보

에러 해결이 안 될 때 AI에게 질문할 때 다음 정보를 포함하세요:

1. **에러 메시지 전체**
2. **운영체제 및 버전**
3. **Node.js 버전**: `node --version`
4. **pnpm 버전**: `pnpm --version`
5. **에러 발생 단계** (설치, 실행, 빌드 등)
6. **시도한 해결 방법**

---

**마지막 업데이트**: 2025-01-23  
**다음 업데이트 예정**: 새로운 에러 발견 시