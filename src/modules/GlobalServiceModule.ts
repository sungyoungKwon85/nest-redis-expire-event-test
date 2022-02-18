import { Global, Module } from "@nestjs/common"

import { TestRedisService } from "../services/TestRedisService";

const services = [
	TestRedisService
]

@Global()
@Module({
	providers: services,
	exports: services,
})
export class GlobalServiceModule { }
