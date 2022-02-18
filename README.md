### 로컬 띄우기 
```
# @nestjs/cli 를 설치
$ npm i -g @nestjs/cli

# typescript-starter
https://github.com/nestjs/typescript-starter

# clone
$ git clone ...

# 필요한 패키지 설치
$ npm install

# 개발단계에서 시작하기
$ npm run start:dev
```

### redis 추가
```
package.json 참고
참고) nest 8버전과 redis에 문제가 있어 버전을 낮춤. 
```


### 기타
```
특정 키만 expired event를 받고 싶었다. 
notify-keyspace-events 는 Kx로 하면 된다. 
그런데 redis set이 정상적으로 등록되지 않았다. 
이부분은 알아봐야 한다.  
```