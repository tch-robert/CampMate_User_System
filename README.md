# CampMate （前台）

### 目的：
CampMate為露營愛好者打造的一站式平台，主要提供露營用品租借、租賃營地和揪團露營活動。

### 技術：
| 前端（front-end） | 後端（back-end） | 其它（others） |
|:----------------:|:--------------:|:-------------:|
| HTML5 ![image](icon_img/html5.png) | Node.js ![image](icon_img/nodejs.png) | Visual Studio Code ![image](icon_img/vscode.png) |
| CSS3 ![image](icon_img/css3.png) | Express ![image](icon_img/express.png) | npm ![image](icon_img/npm.png) |
| SCSS ![image](icon_img/scss.png) | MySQL ![image](icon_img/mysql.png) | Figma ![image](icon_img/figma.png) |
| Bootstrap ![image](icon_img/bootstrap.png) | Sequelize ![image](icon_img/sequelize.png) |  |
| Javascript ES6 ![image](icon_img/javascript.png) |  |  |
| React ![image](icon_img/react.png) |  |  |
| Next.js ![image](icon_img/nextjs.png) |  |  |

### 資料夾簡介：
#### react：
  * 放置所有前端程式碼，以Next.js為前端框架。
  * 依據不同的類別來設計資料夾結構，常見的pages、styles、components、public、hook等等...。

#### express:
  * 放置所有後端程式碼，以express為後端框架。
  * 資料夾結構為了便於管理維護，將不同功能的路由分開撰寫，放置在router資料夾中，並且盡可能的遵照Restful API設計風格，也獨立一個資料夾給常用的middlewares。
  * 應用ORM（Sequelize）快速的部署資料庫環境，因此有models、seeds用來放置資料表模型以及種子。

### 負責部分：
 * 露營用品的商品列表、商品詳細頁、購物車的完整流程（ecpay、linepay）、訂單記錄（商品評價）
