# threejs-puppeteer-template


## 使い方

### 準備
```
$ npm install
```
### 立ち上げ
```
$ npm run start
```


## Dockerでの使い方
```
$ docker compose up
```
M1 Macだとinotifyの都合でうまく動かない。<br>
`linux/amd64`ではQEMUでinotifyが使えない都合で失敗し、<br>
`linux/arm64`ではpuppeteerがバイナリを用意していない都合で失敗する。

## APIへのアクセス

http://localhost:3000/api/capture にアクセスするとbase64で取得できる。


コンテンツサーバーも同じサーバーだが、実際の運用ではポートを分けるなどする。 http://localhost:3000/


## 想定する用途
キャンペーンサイトのSNS投稿などで、動的な`og:image`が必要な場合に、クライアントサイドのWebGLと見た目を揃え、比較的低コストなキャプチャを実現する。<br>
例としてテクスチャの差し替えを想定したクライアントコードを用意した。<br>
テキスト描画や、ユーザーが選んだモデルやテクスチャへの差し替えがあってもいいかもしれない。<br>


