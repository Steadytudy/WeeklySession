"use strict";(self["webpackChunkphoto_gallery_vue"]=self["webpackChunkphoto_gallery_vue"]||[]).push([[990],{8990:function(t,e,n){n.r(e),n.d(e,{createSwipeBackGesture:function(){return i}});var r=n(6587),o=n(545),a=n(6515);
/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
const i=(t,e,n,i,c)=>{const s=t.ownerDocument.defaultView,u=(0,o.i)(t),l=t=>{const e=50,{startX:n}=t;return u?n>=s.innerWidth-e:n<=e},h=t=>u?-t.deltaX:t.deltaX,d=t=>u?-t.velocityX:t.velocityX,p=t=>l(t)&&e(),f=t=>{const e=h(t),n=e/s.innerWidth;i(n)},k=t=>{const e=h(t),n=s.innerWidth,o=e/n,a=d(t),i=n/2,u=a>=0&&(a>.2||e>i),l=u?1-o:o,p=l*n;let f=0;if(p>5){const t=p/Math.abs(a);f=Math.min(t,540)}c(u,o<=0?.01:(0,r.h)(0,o,.9999),f)};return(0,a.A)({el:t,gestureName:"goback-swipe",gesturePriority:40,threshold:10,canStart:p,onStart:n,onMove:f,onEnd:k})}}}]);
//# sourceMappingURL=990.98228143.js.map