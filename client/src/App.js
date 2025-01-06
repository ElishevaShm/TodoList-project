// import React from 'react';
// import { Route, Routes } from "react-router-dom";
// import AppRoutes from "./AppRoutes";
// // import Layout from "./components/Layout";
// import rtlPlugin from 'stylis-plugin-rtl';
// import { CacheProvider } from '@emotion/react';
// import createCache from '@emotion/cache';
// import { prefixer } from 'stylis';

// const cacheRtl = createCache({
//   key: 'muirtl',
//   stylisPlugins: [prefixer, rtlPlugin],
// });

// function App() {
//   return (
//     <div className="App">
//       <CacheProvider value={cacheRtl}>
//         {/* <Layout> */}
//           <Routes>
//             {AppRoutes.map((route, index) => {
//               const { element, ...rest } = route;
//               return <Route key={index} {...rest} element={element} />;
//             })}
//           </Routes>
//         {/* </Layout> */}
//         </CacheProvider>
//     </div>
//   );
// }

// export default App;


import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import AppHeader from "./components/AppHeader";
import rtlPlugin from 'stylis-plugin-rtl';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';

const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

function App() {
  return (
    <BrowserRouter> {/* הוספנו את BrowserRouter */}
      <div className="App">
        <CacheProvider value={cacheRtl}>
          <AppHeader /> {/* הצגת תפריט העליון */}
          <Routes>
            {AppRoutes.map((route, index) => {
              const { element, ...rest } = route;
              return <Route key={index} {...rest} element={element} />;
            })}
          </Routes>
        </CacheProvider>
      </div>
    </BrowserRouter>
  );
}

export default App;
