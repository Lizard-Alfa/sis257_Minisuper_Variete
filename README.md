# Sistema de gestión para Minisúper Variété

## Descripción del negocio

El sistema está pensado para un minisúper dedicado a la venta de productos de consumo diario, como alimentos, bebidas, productos de limpieza y artículos para el hogar.

El sistema permitirá administrar los productos disponibles, organizarlos por categorías, registrar proveedores y clientes, controlar el stock y gestionar las compras y ventas realizadas en el negocio.

## Entidades y campos tentativos

### 1. `categorias`

Permite organizar los productos según su tipo.

Campos:
- `id` (PK)
- `nombre`
- `descripcion`

Ejemplos: Lácteos, Bebidas, Limpieza, Snacks, Abarrotes.

### 2. `proveedores`

Almacena la información de las personas o empresas que suministran productos al minisúper.

Campos:
- `id` (PK)
- `nit`
- `nombre`
- `telefono`
- `direccion`
- `email`
- `activo`

El campo `activo` permitirá deshabilitar un proveedor sin eliminar su información histórica.

### 3. `productos`

Almacena los productos disponibles para la venta, sus precios y la cantidad existente en el negocio.

Campos:
- `id` (PK)
- `id_categoria` (FK)
- `id_proveedor` (FK)
- `codigo_barras` (UNIQUE)
- `nombre`
- `tipo_unidad`
- `precio_compra`
- `precio_venta`
- `stock_actual`
- `stock_minimo`
- `activo`

El campo `activo` permitirá dejar de ofrecer un producto sin eliminarlo de la base de datos.

Ejemplos de `tipo_unidad`: Unidad, Kilogramo, Litro, Bolsa.

### 4. `clientes`

Almacena la información básica de los clientes, principalmente para identificar las ventas que requieran datos del comprador.

Campos:
- `id` (PK)
- `nombre`
- `telefono`
- `direccion`
- `nit_ci`

El campo `nit_ci` puede ser opcional, ya que no todas las ventas requieren registrar los datos del cliente.

### 5. `empleados`

Almacena la información de las personas que trabajan en el minisúper, como cajeros o administradores.

Campos:
- `id` (PK)
- `nombre`
- `cargo`
- `telefono`

La información de acceso al sistema no se almacenará directamente en esta tabla, sino en la entidad `usuarios`.

### 6. `usuarios`

Almacena las credenciales de acceso al sistema y se relaciona con un empleado.

Campos:
- `id` (PK)
- `id_empleado` (FK)
- `usuario`
- `password`
- `activo`

Un empleado podrá tener un usuario para ingresar al sistema. La contraseña deberá almacenarse de forma segura mediante un hash.

### 7. `compras`

Representa la cabecera de una compra realizada a un proveedor.

Campos:
- `id` (PK)
- `id_proveedor` (FK)
- `id_empleado` (FK)
- `fecha`
- `numero_factura`
- `total`
- `estado`

El campo `numero_factura` puede ser opcional cuando una compra no cuente con factura.

### 8. `detalle_compras`

Almacena los productos específicos incluidos en cada compra.

Campos:
- `id` (PK)
- `id_compra` (FK)
- `id_producto` (FK)
- `cantidad`
- `precio_costo`
- `subtotal`

El `precio_costo` permite conservar el precio al que se adquirió el producto en esa compra, aunque posteriormente cambie.

### 9. `ventas`

Representa una venta realizada en el minisúper.

Campos:
- `id` (PK)
- `id_empleado` (FK)
- `id_cliente` (FK, opcional)
- `fecha`
- `subtotal`
- `descuento`
- `total`
- `metodo_pago`
- `estado`

El campo `metodo_pago` permitirá registrar formas de pago como efectivo, QR o tarjeta.

El campo `id_cliente` será opcional porque una venta puede realizarse sin registrar los datos de un cliente.

### 10. `detalle_ventas`

Almacena los productos específicos incluidos en cada venta.

Campos:
- `id` (PK)
- `id_venta` (FK)
- `id_producto` (FK)
- `cantidad`
- `precio_unitario`
- `descuento`
- `subtotal`

## Relaciones principales

- Una categoría puede tener muchos productos.
- Un proveedor puede proporcionar muchos productos.
- Un producto pertenece a una categoría y puede tener un proveedor principal.
- Un proveedor puede tener muchas compras.
- Una compra pertenece a un proveedor y es registrada por un empleado.
- Una compra puede tener varios detalles de compra.
- Un detalle de compra corresponde a un producto.
- Un empleado puede tener un usuario para acceder al sistema.
- Un empleado puede registrar muchas ventas.
- Un cliente puede estar asociado a varias ventas, pero una venta puede no tener cliente registrado.
- Una venta puede tener varios detalles de venta.
- Un detalle de venta corresponde a un producto.