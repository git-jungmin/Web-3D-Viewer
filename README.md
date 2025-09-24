# 📡 File Service API - AWS S3 기반 파일 업로드/삭제 백엔드

> **이 저장소는 파일 관리용 백엔드 API 서버로,** <br />
> **사용자가 업로드한 파일을 AWS S3에 저장하고 필요 시 삭제할 수 있는 REST API를 제공합니다.**

---

## ✨ 주요 기능 (Features)

This is a NestJS-based backend server that provides RESTful APIs to upload, manage, and serve 3D files (GLTF, OBJ, etc.) for use in web-based 3D viewers.

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.
=======
- 파일 업로드 (AWS S3 저장)
- 파일 삭제 (AWS S3 연동)
- NestJS 기반 모듈화된 구조
- DTO, Service, Controller 계층 분리
- 향후 DB 연동을 통한 파일 메타데이터 저장 확장 가능


## 🛠 기술 스택 (Tech Stack)

| 분류      | 기술                          |
| --------- | ----------------------------- |
| Framework | [NestJS](https://nestjs.com/) |
| Language  | TypeScript                    |
| Runtime   | Node.js                       |
| Storage   | AWS S3                        |

---

## 📁 프로젝트 구조 (Project Structure)

