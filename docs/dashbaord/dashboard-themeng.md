# Dashboard Theming


The Vendure dashboard uses a modern theming system based on CSS custom properties and Tailwind CSS . This guide shows you how to customize the colors and styles by modifying the theme variables in the Vite plugin.

[Tailwind CSS](https://tailwindcss.com/)The dashboard also uses the same theming methodology as shadcn/ui

[shadcn/ui](https://ui.shadcn.com/docs/theming)It also uses the shadcn theme provider implementation for Vite

[shadcn theme provider implementation](https://ui.shadcn.com/docs/dark-mode/vite)
## Using Themes in Your Components​


[​](#using-themes-in-your-components)The Vendure dashboard provides a simple way to access theme variables in your components. Here's how to use them:

### Using Tailwind Classes​


[​](#using-tailwind-classes)The easiest way to use theme colors is through Tailwind variable CSS classes:

```
function ProductIdWidgetComponent() {    return (        <div className="text-sm">            <p>                This is a custom widget for the product:                <strong className="ml-1 text-foreground">{product.name}</strong>            </p>            <p className="mt-2 text-muted-foreground">Product ID: {product.id}</p>        </div>    );}
```

## Customizing Theme Colors​


[​](#customizing-theme-colors)You can customize the dashboard theme colors by modifying the theme configuration in your vite.config.mts file. Here's an example showing how to change the primary brand colors:

```
// vite.config.mtsimport { vendureDashboardPlugin } from "@vendure/dashboard/plugin";import { defineConfig } from "vite";// ...other importsexport default defineConfig({  plugins: [    vendureDashboardPlugin({      vendureConfigPath: "./src/vendure-config.ts",      adminUiConfig: { apiHost: "http://localhost", apiPort: 3000 },      gqlOutputPath: "./src/gql",      // Theme section      theme: {        light: {          // Change the primary brand color to blue          primary: "oklch(0.55 0.18 240)",          "primary-foreground": "oklch(0.98 0.01 240)",                    // Update the brand colors to match          brand: "#2563eb", // Blue-600          "brand-lighter": "#93c5fd", // Blue-300        },        dark: {          // Corresponding dark mode colors          primary: "oklch(0.65 0.16 240)",          "primary-foreground": "oklch(0.12 0.03 240)",                    // Same brand colors work for both themes          brand: "#2563eb",          "brand-lighter": "#93c5fd",        },      },    }),  ],});
```

## Inspecting element colors in the browser​


[​](#inspecting-element-colors-in-the-browser)To identify the exact color values used by dashboard elements, you can use your browser's developer tools:

- Right-click on any element and select "Inspect" to open the developer panel.
- Navigate to the Styles tab.
- From there, you can examine the CSS properties and see the actual color values (hex codes, RGB values, or CSS custom properties) being applied to that element.

## Available Theme Variables​


[​](#available-theme-variables)The dashboard defines comprehensive theme variables that are automatically available as Tailwind classes:

### Core Colors​


[​](#core-colors)
### Interactive Colors​


[​](#interactive-colors)
### Semantic Colors​


[​](#semantic-colors)
### Border and Input Colors​


[​](#border-and-input-colors)
### Chart Colors​


[​](#chart-colors)
### Sidebar Colors​


[​](#sidebar-colors)
### Brand Colors​


[​](#brand-colors)
### Typography​


[​](#typography)
### Border Radius​


[​](#border-radius)