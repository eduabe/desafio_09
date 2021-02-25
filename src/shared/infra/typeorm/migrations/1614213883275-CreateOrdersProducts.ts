import { query } from "express";
import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class CreateOrdersProducts1614213883275 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(
            new Table({
                name:'order_products',
                columns:[
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        default: 'uuid_generate_v4()',
                        generationStrategy: 'uuid',
                    },
                    {
                        name: 'product_id',
                        type: 'uuid',
                        isNullable: true,
                    },
                    {
                        name: 'order_id',
                        type: 'uuid',
                        isNullable: true,
                    },
                    {
                        name: 'price',
                        type: 'double precision',
                    },
                    {
                        name: 'quantity',
                        type: 'int'
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'now()',
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'now()',
                    },
                ]
            })
        );

        await queryRunner.createForeignKey(
            'order_products',
            new TableForeignKey({
                columnNames:['product_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'products',
                onDelete: 'SET NULL',
                onUpdate: 'CASCADE',
                name: 'OrdersProductsProducts'
            })
        );

        await queryRunner.createForeignKey(
            'order_products',
            new TableForeignKey({
                columnNames:['order_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'orders',
                onDelete: 'SET NULL',
                onUpdate: 'CASCADE',
                name: 'OrdersProductsOrders'
            })
        );
        
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('order_products');
    }

}
