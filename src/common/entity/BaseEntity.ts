import { CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Exclude, Expose } from "class-transformer";
import dayjs from "dayjs";
import { dayjsUtil } from "../utils/dayjs.util";

export class ShardEntity {
    @Exclude()
    @CreateDateColumn()
    createdAt: Date;

    @Exclude()
    @UpdateDateColumn()
    updatedAt: Date;

    @Expose()
    get created_At(): string {
        return dayjsUtil(this.createdAt);
    }

    @Expose()
    get updated_At(): string {
        return dayjsUtil(this.updatedAt);
    }
}
