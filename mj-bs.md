# mj-bs.js

- mj-bs.js 是基於 mj.js 和 Bootstrap 的前端框架.
- mj.js 是受 Mithril 啟發的基於 jQuery 實現的極簡框架.

## jQuery 最大的問題

jQuery 最大的問題是没有真正的組件, HTML 與 JavaScript 分離, 不方便組件化.

如果 jQuery 可以:

- 只寫 JavaScript, 完全不用寫 HTML, 一個 object 就是一個完整的組件.
- 組件是 **真組件**, 一個組件可以嵌套另一個組件, 組件之間可以交流.
- 可以預製組件, 輕鬆複用, 可以自帶樣式, 也可以隨時修改樣式.
- 組件可以有自己的方法, 通過調用方法對組件進行各種操作.
- **並且這一切完全由最普通的 jQuery 語句組成**, 學習成本接近零.
- 不需要 npm, 不需要 Webpack 或 Vite 等, 不需要任何構建, 直接寫 JS 就行.

那麼, 可想而知, 這會非常易用, 用起來非常舒服.

## 解決方案

[mj.js](https://github.com/ahui2016/mj.js) 做到了上面 "如果" 的事.

第一版 mj.js 只用了兩個小函數共約 10 行代碼就做到了,
經過長時間使用, 發展為第二版 mj.js, 有三個函數共約 40 行代碼,
依然極致簡單, 學習成本接近零的同時做到了真正的組件化.

## mj.js + Bootstrap = mj-bs.js

在 mj.js 的基礎上, 我寫了一些小函數使其與 Bootstrap, dayjs, axios
有機結合在一起, 形成了 **一些組件**.

**這些組件** 正是如何使用 mj.js 的最生動的例子.