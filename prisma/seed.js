const { PrismaClient, OrderStatus } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed...");

  // Eliminar datos previos para evitar duplicados
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();

  // Crear productos
  const products = await prisma.product.createMany({
    data: [
      {
        name: "Camiseta Argentina 2022",
        description: "Edición oficial de la AFA",
        priceCents: 12000, // en centavos = 120.00
        imageUrl: "https://example.com/argentina.jpg"
      },
      {
        name: "Camiseta Brasil 2022",
        description: "Edición oficial de la CBF",
        priceCents: 11000,
        imageUrl: "https://example.com/brasil.jpg"
      },
      {
        name: "Camiseta México 2022",
        description: "Edición oficial de la FMF",
        priceCents: 10000,
        imageUrl: "https://example.com/mexico.jpg"
      }
    ]
  });

  console.log(`✅ Productos insertados: ${products.count}`);

  // Buscar productos para relacionarlos en órdenes
  const argentina = await prisma.product.findFirst({ where: { name: "Camiseta Argentina 2022" } });
  const brasil = await prisma.product.findFirst({ where: { name: "Camiseta Brasil 2022" } });

  // Crear órdenes
  await prisma.order.createMany({
    data: [
      {
        productId: argentina.id,
        status: OrderStatus.APPROVED,
        buyerEmail: "cliente1@example.com",
        externalRef: "ORD-001"
      },
      {
        productId: brasil.id,
        status: OrderStatus.PENDING,
        buyerEmail: "cliente2@example.com",
        externalRef: "ORD-002"
      }
    ]
  });

  console.log("✅ Órdenes insertadas");
}

main()
  .then(() => {
    console.log("🌱 Seed finalizado con éxito");
    prisma.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
