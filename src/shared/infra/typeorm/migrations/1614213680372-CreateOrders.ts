import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class CreateOrders1614213680372 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(
            new Table({
                name:'orders',
                columns:[
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        default: 'uuid_generate_v4()',
                        generationStrategy: 'uuid',
                    },
                    {
                        name: 'customer_id',
                        type: 'uuid'
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
            'orders',
            new TableForeignKey({
                columnNames:['customer_id'],
                referencedColumnNames:['id'],
                referencedTableName: 'customers',
                onDelete:'SET NULL',
                onUpdate:'CASCADE',
                name:'ordersCustomer'
            }) 
        )
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('orders');
    }

}
