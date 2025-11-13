// vite.config.js
import react from "file:///C:/Users/xpovo/Documents/premium-ecosystem/node_modules/@vitejs/plugin-react/dist/index.js";
import { defineConfig } from "file:///C:/Users/xpovo/Documents/premium-ecosystem/node_modules/vite/dist/node/index.js";
import { visualizer } from "file:///C:/Users/xpovo/Documents/premium-ecosystem/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
var vite_config_default = defineConfig(({ mode }) => ({
  plugins: [
    react({
      // Optimización de Fast Refresh
      fastRefresh: true,
      // Optimización de babel
      babel: {
        compact: false
      }
    }),
    // Bundle analyzer (solo en análisis)
    ...process.env.ANALYZE ? [visualizer({ open: true, gzipSize: true, brotliSize: true })] : []
    // TODO: PWA Configuration - Will be added in Phase 3 after resolving vite-plugin-pwa installation
  ],
  server: {
    port: 3001,
    host: true,
    open: false,
    strictPort: false,
    hmr: {
      overlay: true
    },
    watch: {
      usePolling: false,
      ignored: ["**/node_modules/**", "**/.git/**", "**/dist/**"]
    }
  },
  build: {
    outDir: "dist",
    sourcemap: process.env.NODE_ENV !== "production",
    // Solo dev/staging
    minify: "esbuild",
    // Using esbuild (faster, built-in with Vite)
    esbuild: {
      drop: process.env.NODE_ENV === "production" ? ["console", "debugger"] : [],
      legalComments: "none"
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            if (id.includes("react") || id.includes("react-dom") || id.includes("react-router")) {
              return "react-vendor";
            }
            if (id.includes("zustand") || id.includes("react-query") || id.includes("react-hook-form") || id.includes("zod")) {
              return "state-vendor";
            }
            if (id.includes("framer-motion")) {
              return "animation-vendor";
            }
            if (id.includes("three") || id.includes("@react-three")) {
              return "three-vendor";
            }
            if (id.includes("recharts") || id.includes("d3-")) {
              return "charts-vendor";
            }
            if (id.includes("lucide-react")) {
              return "icons-vendor";
            }
            if (id.includes("class-variance-authority") || id.includes("clsx") || id.includes("tailwind-merge")) {
              return "ui-vendor";
            }
            if (id.includes("firebase")) {
              return "firebase-vendor";
            }
            return "vendor";
          }
          if (id.includes("/apps/FlowDistributor/")) {
            if (id.includes("/components/Panel")) {
              return "flowdist-panels";
            }
            if (id.includes("/components/Dashboard")) {
              return "flowdist-dashboards";
            }
            if (id.includes("/components/forms")) {
              return "flowdist-forms";
            }
            if (id.includes("/analysis/")) {
              return "flowdist-analysis";
            }
            if (id.includes("/data/")) {
              return "flowdist-data";
            }
            return "flowdist-core";
          }
        },
        // Optimizar nombres de archivos
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: "assets/[ext]/[name]-[hash].[ext]"
      }
    },
    chunkSizeWarningLimit: 800,
    // Advertir si chunk > 800KB
    target: "es2020",
    cssCodeSplit: true,
    // Split CSS por chunks
    assetsInlineLimit: 4096
    // Inline assets < 4KB
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "framer-motion",
      "lucide-react",
      "recharts",
      "zustand",
      "axios",
      "date-fns",
      "clsx",
      "tailwind-merge"
    ],
    exclude: [
      "@react-three/fiber",
      "@react-three/drei",
      "three"
    ],
    esbuildOptions: {
      target: "es2020",
      supported: {
        "top-level-await": true
      }
    }
  },
  resolve: {
    alias: {
      "@": "/src",
      "@components": "/src/components",
      "@apps": "/src/apps",
      "@hooks": "/src/hooks",
      "@stores": "/src/stores",
      "@utils": "/src/utils",
      "@services": "/src/services",
      "@config": "/src/config"
    }
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.js",
    css: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      exclude: [
        "node_modules/",
        "src/test/",
        "**/*.config.js",
        "**/mock*.js",
        "**/*.test.{js,jsx}",
        "**/*.spec.{js,jsx}",
        "**/dist/**"
      ],
      all: true,
      lines: 80,
      functions: 80,
      branches: 75,
      statements: 80
    },
    testTimeout: 1e4,
    hookTimeout: 1e4
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFx4cG92b1xcXFxEb2N1bWVudHNcXFxccHJlbWl1bS1lY29zeXN0ZW1cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXHhwb3ZvXFxcXERvY3VtZW50c1xcXFxwcmVtaXVtLWVjb3N5c3RlbVxcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMveHBvdm8vRG9jdW1lbnRzL3ByZW1pdW0tZWNvc3lzdGVtL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0JztcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHsgdmlzdWFsaXplciB9IGZyb20gJ3JvbGx1cC1wbHVnaW4tdmlzdWFsaXplcic7XG4vLyBpbXBvcnQgeyBWaXRlUFdBIH0gZnJvbSAndml0ZS1wbHVnaW4tcHdhJzsgLy8gVE9ETzogUmUtZW5hYmxlIGFmdGVyIHBhY2thZ2UgaW5zdGFsbGF0aW9uIGlzc3VlIGlzIHJlc29sdmVkXG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+ICh7XG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCh7XG4gICAgICAvLyBPcHRpbWl6YWNpXHUwMEYzbiBkZSBGYXN0IFJlZnJlc2hcbiAgICAgIGZhc3RSZWZyZXNoOiB0cnVlLFxuICAgICAgLy8gT3B0aW1pemFjaVx1MDBGM24gZGUgYmFiZWxcbiAgICAgIGJhYmVsOiB7XG4gICAgICAgIGNvbXBhY3Q6IGZhbHNlLFxuICAgICAgfSxcbiAgICB9KSxcbiAgICAvLyBCdW5kbGUgYW5hbHl6ZXIgKHNvbG8gZW4gYW5cdTAwRTFsaXNpcylcbiAgICAuLi4ocHJvY2Vzcy5lbnYuQU5BTFlaRSA/IFt2aXN1YWxpemVyKHsgb3BlbjogdHJ1ZSwgZ3ppcFNpemU6IHRydWUsIGJyb3RsaVNpemU6IHRydWUgfSldIDogW10pLFxuICAgIC8vIFRPRE86IFBXQSBDb25maWd1cmF0aW9uIC0gV2lsbCBiZSBhZGRlZCBpbiBQaGFzZSAzIGFmdGVyIHJlc29sdmluZyB2aXRlLXBsdWdpbi1wd2EgaW5zdGFsbGF0aW9uXG4gIF0sXG4gIHNlcnZlcjoge1xuICAgIHBvcnQ6IDMwMDEsXG4gICAgaG9zdDogdHJ1ZSxcbiAgICBvcGVuOiBmYWxzZSxcbiAgICBzdHJpY3RQb3J0OiBmYWxzZSxcbiAgICBobXI6IHtcbiAgICAgIG92ZXJsYXk6IHRydWUsXG4gICAgfSxcbiAgICB3YXRjaDoge1xuICAgICAgdXNlUG9sbGluZzogZmFsc2UsXG4gICAgICBpZ25vcmVkOiBbJyoqL25vZGVfbW9kdWxlcy8qKicsICcqKi8uZ2l0LyoqJywgJyoqL2Rpc3QvKionXSxcbiAgICB9LFxuICB9LFxuICBidWlsZDoge1xuICAgIG91dERpcjogJ2Rpc3QnLFxuICAgIHNvdXJjZW1hcDogcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJywgLy8gU29sbyBkZXYvc3RhZ2luZ1xuICAgIG1pbmlmeTogJ2VzYnVpbGQnLCAvLyBVc2luZyBlc2J1aWxkIChmYXN0ZXIsIGJ1aWx0LWluIHdpdGggVml0ZSlcbiAgICBlc2J1aWxkOiB7XG4gICAgICBkcm9wOiBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nID8gWydjb25zb2xlJywgJ2RlYnVnZ2VyJ10gOiBbXSxcbiAgICAgIGxlZ2FsQ29tbWVudHM6ICdub25lJyxcbiAgICB9LFxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBtYW51YWxDaHVua3M6IChpZCkgPT4ge1xuICAgICAgICAgIC8vIFZlbmRvciBjaHVua3NcbiAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ25vZGVfbW9kdWxlcycpKSB7XG4gICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ3JlYWN0JykgfHwgaWQuaW5jbHVkZXMoJ3JlYWN0LWRvbScpIHx8IGlkLmluY2x1ZGVzKCdyZWFjdC1yb3V0ZXInKSkge1xuICAgICAgICAgICAgICByZXR1cm4gJ3JlYWN0LXZlbmRvcic7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ3p1c3RhbmQnKSB8fCBpZC5pbmNsdWRlcygncmVhY3QtcXVlcnknKSB8fCBpZC5pbmNsdWRlcygncmVhY3QtaG9vay1mb3JtJykgfHwgaWQuaW5jbHVkZXMoJ3pvZCcpKSB7XG4gICAgICAgICAgICAgIHJldHVybiAnc3RhdGUtdmVuZG9yJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnZnJhbWVyLW1vdGlvbicpKSB7XG4gICAgICAgICAgICAgIHJldHVybiAnYW5pbWF0aW9uLXZlbmRvcic7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ3RocmVlJykgfHwgaWQuaW5jbHVkZXMoJ0ByZWFjdC10aHJlZScpKSB7XG4gICAgICAgICAgICAgIHJldHVybiAndGhyZWUtdmVuZG9yJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygncmVjaGFydHMnKSB8fCBpZC5pbmNsdWRlcygnZDMtJykpIHtcbiAgICAgICAgICAgICAgcmV0dXJuICdjaGFydHMtdmVuZG9yJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnbHVjaWRlLXJlYWN0JykpIHtcbiAgICAgICAgICAgICAgcmV0dXJuICdpY29ucy12ZW5kb3InO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdjbGFzcy12YXJpYW5jZS1hdXRob3JpdHknKSB8fCBpZC5pbmNsdWRlcygnY2xzeCcpIHx8IGlkLmluY2x1ZGVzKCd0YWlsd2luZC1tZXJnZScpKSB7XG4gICAgICAgICAgICAgIHJldHVybiAndWktdmVuZG9yJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnZmlyZWJhc2UnKSkge1xuICAgICAgICAgICAgICByZXR1cm4gJ2ZpcmViYXNlLXZlbmRvcic7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBPdHJvcyBub2RlX21vZHVsZXNcbiAgICAgICAgICAgIHJldHVybiAndmVuZG9yJztcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gRmxvd0Rpc3RyaWJ1dG9yIGNodW5rcyAobGF6eSBsb2FkaW5nIHBvciBmZWF0dXJlKVxuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnL2FwcHMvRmxvd0Rpc3RyaWJ1dG9yLycpKSB7XG4gICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJy9jb21wb25lbnRzL1BhbmVsJykpIHtcbiAgICAgICAgICAgICAgcmV0dXJuICdmbG93ZGlzdC1wYW5lbHMnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCcvY29tcG9uZW50cy9EYXNoYm9hcmQnKSkge1xuICAgICAgICAgICAgICByZXR1cm4gJ2Zsb3dkaXN0LWRhc2hib2FyZHMnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCcvY29tcG9uZW50cy9mb3JtcycpKSB7XG4gICAgICAgICAgICAgIHJldHVybiAnZmxvd2Rpc3QtZm9ybXMnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCcvYW5hbHlzaXMvJykpIHtcbiAgICAgICAgICAgICAgcmV0dXJuICdmbG93ZGlzdC1hbmFseXNpcyc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJy9kYXRhLycpKSB7XG4gICAgICAgICAgICAgIHJldHVybiAnZmxvd2Rpc3QtZGF0YSc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gJ2Zsb3dkaXN0LWNvcmUnO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgLy8gT3B0aW1pemFyIG5vbWJyZXMgZGUgYXJjaGl2b3NcbiAgICAgICAgY2h1bmtGaWxlTmFtZXM6ICdhc3NldHMvanMvW25hbWVdLVtoYXNoXS5qcycsXG4gICAgICAgIGVudHJ5RmlsZU5hbWVzOiAnYXNzZXRzL2pzL1tuYW1lXS1baGFzaF0uanMnLFxuICAgICAgICBhc3NldEZpbGVOYW1lczogJ2Fzc2V0cy9bZXh0XS9bbmFtZV0tW2hhc2hdLltleHRdJyxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBjaHVua1NpemVXYXJuaW5nTGltaXQ6IDgwMCwgLy8gQWR2ZXJ0aXIgc2kgY2h1bmsgPiA4MDBLQlxuICAgIHRhcmdldDogJ2VzMjAyMCcsXG4gICAgY3NzQ29kZVNwbGl0OiB0cnVlLCAvLyBTcGxpdCBDU1MgcG9yIGNodW5rc1xuICAgIGFzc2V0c0lubGluZUxpbWl0OiA0MDk2LCAvLyBJbmxpbmUgYXNzZXRzIDwgNEtCXG4gIH0sXG4gIG9wdGltaXplRGVwczoge1xuICAgIGluY2x1ZGU6IFtcbiAgICAgICdyZWFjdCcsXG4gICAgICAncmVhY3QtZG9tJyxcbiAgICAgICdyZWFjdC1yb3V0ZXItZG9tJyxcbiAgICAgICdmcmFtZXItbW90aW9uJyxcbiAgICAgICdsdWNpZGUtcmVhY3QnLFxuICAgICAgJ3JlY2hhcnRzJyxcbiAgICAgICd6dXN0YW5kJyxcbiAgICAgICdheGlvcycsXG4gICAgICAnZGF0ZS1mbnMnLFxuICAgICAgJ2Nsc3gnLFxuICAgICAgJ3RhaWx3aW5kLW1lcmdlJyxcbiAgICBdLFxuICAgIGV4Y2x1ZGU6IFtcbiAgICAgICdAcmVhY3QtdGhyZWUvZmliZXInLFxuICAgICAgJ0ByZWFjdC10aHJlZS9kcmVpJyxcbiAgICAgICd0aHJlZScsXG4gICAgXSxcbiAgICBlc2J1aWxkT3B0aW9uczoge1xuICAgICAgdGFyZ2V0OiAnZXMyMDIwJyxcbiAgICAgIHN1cHBvcnRlZDoge1xuICAgICAgICAndG9wLWxldmVsLWF3YWl0JzogdHJ1ZSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnQCc6ICcvc3JjJyxcbiAgICAgICdAY29tcG9uZW50cyc6ICcvc3JjL2NvbXBvbmVudHMnLFxuICAgICAgJ0BhcHBzJzogJy9zcmMvYXBwcycsXG4gICAgICAnQGhvb2tzJzogJy9zcmMvaG9va3MnLFxuICAgICAgJ0BzdG9yZXMnOiAnL3NyYy9zdG9yZXMnLFxuICAgICAgJ0B1dGlscyc6ICcvc3JjL3V0aWxzJyxcbiAgICAgICdAc2VydmljZXMnOiAnL3NyYy9zZXJ2aWNlcycsXG4gICAgICAnQGNvbmZpZyc6ICcvc3JjL2NvbmZpZycsXG4gICAgfSxcbiAgfSxcbiAgdGVzdDoge1xuICAgIGdsb2JhbHM6IHRydWUsXG4gICAgZW52aXJvbm1lbnQ6ICdqc2RvbScsXG4gICAgc2V0dXBGaWxlczogJy4vc3JjL3Rlc3Qvc2V0dXAuanMnLFxuICAgIGNzczogdHJ1ZSxcbiAgICBjb3ZlcmFnZToge1xuICAgICAgcHJvdmlkZXI6ICd2OCcsXG4gICAgICByZXBvcnRlcjogWyd0ZXh0JywgJ2pzb24nLCAnaHRtbCcsICdsY292J10sXG4gICAgICBleGNsdWRlOiBbXG4gICAgICAgICdub2RlX21vZHVsZXMvJyxcbiAgICAgICAgJ3NyYy90ZXN0LycsXG4gICAgICAgICcqKi8qLmNvbmZpZy5qcycsXG4gICAgICAgICcqKi9tb2NrKi5qcycsXG4gICAgICAgICcqKi8qLnRlc3Que2pzLGpzeH0nLFxuICAgICAgICAnKiovKi5zcGVjLntqcyxqc3h9JyxcbiAgICAgICAgJyoqL2Rpc3QvKionLFxuICAgICAgXSxcbiAgICAgIGFsbDogdHJ1ZSxcbiAgICAgIGxpbmVzOiA4MCxcbiAgICAgIGZ1bmN0aW9uczogODAsXG4gICAgICBicmFuY2hlczogNzUsXG4gICAgICBzdGF0ZW1lbnRzOiA4MCxcbiAgICB9LFxuICAgIHRlc3RUaW1lb3V0OiAxMDAwMCxcbiAgICBob29rVGltZW91dDogMTAwMDAsXG4gIH0sXG59KSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTBULE9BQU8sV0FBVztBQUM1VSxTQUFTLG9CQUFvQjtBQUM3QixTQUFTLGtCQUFrQjtBQUczQixJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLEtBQUssT0FBTztBQUFBLEVBQ3pDLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQTtBQUFBLE1BRUosYUFBYTtBQUFBO0FBQUEsTUFFYixPQUFPO0FBQUEsUUFDTCxTQUFTO0FBQUEsTUFDWDtBQUFBLElBQ0YsQ0FBQztBQUFBO0FBQUEsSUFFRCxHQUFJLFFBQVEsSUFBSSxVQUFVLENBQUMsV0FBVyxFQUFFLE1BQU0sTUFBTSxVQUFVLE1BQU0sWUFBWSxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUM7QUFBQTtBQUFBLEVBRTlGO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixZQUFZO0FBQUEsSUFDWixLQUFLO0FBQUEsTUFDSCxTQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0EsT0FBTztBQUFBLE1BQ0wsWUFBWTtBQUFBLE1BQ1osU0FBUyxDQUFDLHNCQUFzQixjQUFjLFlBQVk7QUFBQSxJQUM1RDtBQUFBLEVBQ0Y7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLFFBQVE7QUFBQSxJQUNSLFdBQVcsUUFBUSxJQUFJLGFBQWE7QUFBQTtBQUFBLElBQ3BDLFFBQVE7QUFBQTtBQUFBLElBQ1IsU0FBUztBQUFBLE1BQ1AsTUFBTSxRQUFRLElBQUksYUFBYSxlQUFlLENBQUMsV0FBVyxVQUFVLElBQUksQ0FBQztBQUFBLE1BQ3pFLGVBQWU7QUFBQSxJQUNqQjtBQUFBLElBQ0EsZUFBZTtBQUFBLE1BQ2IsUUFBUTtBQUFBLFFBQ04sY0FBYyxDQUFD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
