# Sistema de Gestión para Minisúper Variété

## Descripción del negocio

El sistema está diseñado para la administración integral de un minisúper dedicado a la venta de productos de consumo diario (alimentos, bebidas, artículos de limpieza y hogar).

Permite administrar el catálogo de productos por categorías, gestionar proveedores y clientes, controlar el inventario en tiempo real y registrar tanto el proceso de ventas en caja como el abastecimiento mediante compras.

---

# Modelo de Base de Datos - Sistema de Ventas

Este documento describe la estructura del modelo entidad-relación del sistema, detallando las entidades, sus atributos, las llaves primarias (PK), llaves foráneas (FK) y las relaciones correspondientes.

---

# Sistema de Ventas

## Entidades y atributos

**Categoria**
- nombre (PK)
- id (autogenerado)

**Proveedor**
- nit_ci (PK)
- id (autogenerado)
- nombres
- apellidos
- telefono
- direccion
- email

**Productos**
- codigo (PK)
- id (autogenerado)
- nombre_categoria (FK → Categoria)
- nit_ci_proveedor (FK → Proveedor)
- nombre
- imagen
- unidad_medida
- precio
- estado

**Cliente**
- ci_nit (PK)
- nombres
- apellidos

**Trabajadores**
- ci (PK)
- id (autogenerado)
- nombres
- apellidos
- telefono
- direccion

**Usuario**
- usuario (PK)
- ci_trabajador (FK → Trabajadores)
- id (autogenerado)
- contraseña

**Ventas**
- numero_venta (PK)
- id (autogenerado)
- ci_trabajador (FK → Trabajadores)
- ci_nit_cliente (FK → Cliente)
- descuento
- sub_total
- metodo_pago
- total
- fecha_venta

**VentaDetalles**
- id (PK, autogenerado)
- numero_venta (FK → Ventas)
- codigo_producto (FK → Productos)
- cantidad
- precio_unitario
- sub_total
- fecha

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