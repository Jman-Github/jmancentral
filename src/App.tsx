import { createBrowserRouter, Navigate, Outlet, ScrollRestoration } from "react-router";
import { RouterProvider } from "react-router/dom";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import SocialLinks from "@/pages/SocialLinks";

// React Router reads each history entry's key from history.state and labels entries without one
// "default". Every fresh page load (typed URL, external link) would then share that key, and
// ScrollRestoration would restore the previous load's scroll position instead of honouring the
// URL hash or starting at the top. A unique key per entry fixes that; reloads and back/forward
// keep it because the browser preserves history.state.
function ensureHistoryKey() {
  if (!window.history.state?.key) {
    window.history.replaceState({ ...window.history.state, key: Math.random().toString(36).slice(2, 10) }, "");
  }
}
ensureHistoryKey();
// Entries the browser creates itself (editing the #hash in the address bar) also arrive without a
// key. This listener is registered before the router's, so the key exists by the time it reads it.
window.addEventListener("popstate", ensureHistoryKey);

// ScrollRestoration starts link navigations at the top, scrolls to #hash targets, and restores
// the position on back/forward.
function Root() {
  return (
    <>
      <ScrollRestoration />
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Root />,
    children: [
      { path: "/", element: <Index /> },
      { path: "/social", element: <SocialLinks /> },
      // GitHub Pages also serves these files directly; send them to the canonical routes.
      { path: "/index.html", element: <Navigate to="/" replace /> },
      { path: "/social/index.html", element: <Navigate to="/social" replace /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

const App = () => <RouterProvider router={router} />;

export default App;
