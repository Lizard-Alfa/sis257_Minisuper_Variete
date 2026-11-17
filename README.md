# Sistema de Gestión para Minisúper Variété

## Descripción del negocio

El sistema está diseñado para la administración integral de un minisúper dedicado a la venta de productos de consumo diario (alimentos, bebidas, artículos de limpieza y hogar).

---

# Modelo de Base de Datos - Sistema de Ventas

Este documento describe la estructura del modelo entidad-relación del sistema, detallando las entidades, sus atributos, las llaves primarias (PK), llaves foráneas (FK) y las relaciones correspondientes.

---

# Sistema de Ventas

## Entidades y atributos

**Categoria**
- id (autogenerado, PK)
- nombre (cadena 50) — OBLIGATORIO

**Proveedor**
- id (autogenerado, PK)
- nitCi (cadena 15) — OBLIGATORIO
- nombres (cadena 50) — OBLIGATORIO
- razonSocial (cadena 50) — OPCIONAL
- telefono (cadena 20) — OPCIONAL
- direccion (cadena 100) — OPCIONAL
- email (cadena 100) — OPCIONAL

**Productos**
- id (autogenerado, PK)
- codigo (cadena 20) — OBLIGATORIO
- nombre (cadena 100) — OBLIGATORIO
- idCategoria (entero, FK → Categoria) — OBLIGATORIO
- idProveedor (entero, FK → Proveedor) — OPCIONAL
- imagen (cadena 500) — OPCIONAL
- unidadMedida (cadena 50) — OBLIGATORIO
- stock (entero) — OBLIGATORIO (puede ser 0)
- stockMinimo (entero) — OBLIGATORIO (puede ser 0)
- precioVenta (decimal) — OBLIGATORIO
- precioDescuento (decimal) — OPCIONAL (0 = sin descuento)
- descuentoInicio (fecha) — OPCIONAL
- descuentoFin (fecha) — OPCIONAL

**Cliente**
- id (autogenerado, PK)
- nitCi (cadena 15) — OPCIONAL
- nombres (cadena 50) — OBLIGATORIO
- apellidos (cadena 50) — OPCIONAL
- telefono (cadena 15) — OPCIONAL

**Trabajadores**
- id (autogenerado, PK)
- ci (cadena 15) — OBLIGATORIO
- nombres (cadena 50) — OBLIGATORIO
- apellidos (cadena 50) — OBLIGATORIO
- telefono (cadena 20) — OPCIONAL
- direccion (cadena 50) — OPCIONAL

**Usuario**
- id (autogenerado, PK)
- idTrabajador (entero, FK → Trabajadores) — OBLIGATORIO
- usuario (cadena 12) — OBLIGATORIO
- clave (cadena 225) — OBLIGATORIO
- email (cadena 50) — OPCIONAL
- rol (cadena 15) — OBLIGATORIO

**Ventas**
- id (autogenerado, PK)
- transaccion (cadena 15) — OBLIGATORIO
- idTrabajador (entero, FK → Trabajadores) — OBLIGATORIO
- idCliente (entero, FK → Cliente) — OBLIGATORIO
- metodoPago (cadena 15) — OBLIGATORIO
- observaciones (cadena 50) — OPCIONAL
- subtotal (decimal) — OBLIGATORIO
- total (decimal) — OBLIGATORIO
- estado (cadena: activa/anulada) — OBLIGATORIO

**VentaDetalles**
- id (autogenerado, PK)
- idVenta (entero, FK → Ventas) — OBLIGATORIO
- idProducto (entero, FK → Productos) — OBLIGATORIO
- cantidad (entero) — OBLIGATORIO
- descuentoMonto (decimal) — OPCIONAL
- precioUnitario (decimal) — OBLIGATORIO
- subtotal (decimal) — OBLIGATORIO

## Relaciones

| Entidad A | Relación | Entidad B |
|---|---|---|
| Categoria | 1 : N | Productos |
| Proveedor | 1 : N | Productos |
| Productos | 1 : N | VentaDetalles |
| Ventas | 1 : N | VentaDetalles |
| Trabajadores | 1 : N | Ventas |
| Cliente | 1 : N | Ventas |
| Trabajadores | 1 : 1 | Usuario |