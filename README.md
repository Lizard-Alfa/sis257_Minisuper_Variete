# Sistema de Gestión para Minisúper Variété

## Descripción del negocio

El sistema está diseñado para la administración integral de un minisúper dedicado a la venta de productos de consumo diario (alimentos, bebidas, artículos de limpieza y hogar).

Permite administrar el catálogo de productos por categorías, gestionar proveedores y clientes, controlar el inventario en tiempo real y registrar tanto el proceso de ventas en caja como el abastecimiento mediante compras.

---

## Entidades y Campos

### 1. `categorias`
Organiza los productos según su tipo dentro de la tienda.
* `id automatico` (`INT`)
* `nombre` (PK, `VARCHAR(50)`)

### 2. `proveedores`
Almacena la información de las personas o empresas suministradoras.
* `id automatico` (`INT`)
* `nit_ci` (PK, `VARCHAR(20)`)
* `nombres` (`VARCHAR(50)`)
* `apellidos` (`VARCHAR(50)`)
* `telefono` (`VARCHAR(20)`)
* `direccion` (`VARCHAR(50)`)
* `email` (`VARCHAR(50)`)

### 3. `productos`
Almacena los artículos disponibles para la venta y su nivel de existencias.
* `id automatico` (`INT`)
* `codigo` (PK, `VARCHAR(20)`)
* `id_categoria` (FK)
* `id_proveedor` (FK)
* `nombre` (`VARCHAR(50)`)
* `imagen` (`VARCHAR(200)`)
* `unidaMedida` (`VARCHAR`)
* `precio` (`DECIMAL`)
* `estado` (`VARCHAR`)

### 4. `cliente`
Almacena la información de los compradores registrados para la emisión de notas/facturas.
* `id automatico` (`INT`)
* `ci_nit` (PK, `VARCHAR(20)`)
* `nombres` (`VARCHAR(50)`)
* `apellidos` (`VARCHAR(50)`)

### 5. `trabajadores`
Almacena al personal operativo del minisúper (cajeros, administradores).
* `id automatico` (`INT`)
* `ci` (PK, `VARCHAR(20)`)
* `nombres` (`VARCHAR(50)`)
* `apellidos` (`VARCHAR(50)`)
* `telefono` (`VARCHAR(10)`)
* `direccion` (`VARCHAR(50)`)

### 6. `usuario`
Almacena las credenciales de acceso vinculadas al personal del minisúper.
* `id automatico` (`INT`)
* `usuario` (PK, `VARCHAR(60)`)
* `ci_Trabajador` (FK)
* `contraseña` (`VARCHAR`)

### 7. `ventas`
Representa la cabecera de la transacción de venta realizada en caja.
* `id automatico` (`INT`)
* `numero_Venta` (PK)
* `id_trabajador` (FK)
* `id_cliente` (FK)
* `descuento` (`DECIMAL`)
* `sub_total` (`DECIMAL`)
* `metodo de pago` (`VARCHAR`)
* `toral` (`DECIMAL`)

### 8. `venta_detalles`
Almacena los productos específicos incluidos en el ticket de venta.
* `id automatico` (PK)
* `id_venta` (FK)
* `id_productos` (FK)
* `fecha` (`TIMESTAMP`)
* `cantidad` (`INT`)
* `precio_unitario` (`DECIMAL`)
* `sub_total` (`DECIMAL`)

### 9. `compras`
Representa la cabecera del registro de abastecimiento a proveedores.
* `id automatico` (`INT`)
* `numero_Compra` (PK)
* `nit_proveedor` (FK)
* `id_trabajador` (FK)
* `sub_total` (`DECIMAL`)
* `total` (`DECIMAL`)

### 10. `compra_detalles`
Almacena los ítems específicos ingresados al inventario en una compra.
* `id automatico` (PK)
* `id_compra` (FK)
* `id_producto` (FK)
* `fecha` (`TIMESTAMP`)
* `cantidad` (`INT`)
* `precio_costo` (`DECIMAL`)
* `sub_total` (`DECIMAL`)

---

## Relaciones Principales

- **Categoría ── (1:N) ── Productos:** Una categoría organiza múltiples productos.
- **Proveedor ── (1:N) ── Productos:** Un proveedor surte varios productos del catálogo.
- **Proveedor ── (1:N) ── Compras:** Un proveedor puede estar asociado a múltiples registros de compras.
- **Trabajadores ── (1:1) ── Usuario:** Un trabajador cuenta con un usuario individual para autenticarse.
- **Trabajadores ── (1:N) ── Ventas:** Un trabajador atiende y registra múltiples ventas.
- **Trabajadores ── (1:N) ── Compras:** Un trabajador registra la recepción de las compras.
- **Cliente ── (1:N) ── Ventas:** Un cliente puede tener asociadas varias ventas.
- **Ventas ── (1:N) ── VentaDetalles:** Una venta se desglosa en uno o más detalles de producto.
- **Productos ── (1:N) ── VentaDetalles:** Un producto aparece en múltiples registros de venta.
- **Compras ── (1:N) ── CompraDetalles:** Una compra agrupa varios detalles de productos recibidos.
- **Productos ── (1:N) ── CompraDetalles:** Un producto es abastecido a través de distintas compras.