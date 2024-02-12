import {ConfigModule, ConfigService} from "@nestjs/config";
import {MongooseModuleFactoryOptions} from "@nestjs/mongoose";

export const getMongoConfig = async (
	configService: ConfigService,
): Promise<MongooseModuleFactoryOptions> => {
	return {
		uri: getMongoUri(configService),
	};
};

export const getMongoUri = (configService: ConfigService) => {
	const host = configService.get('MONGO_HOST');
	const username = configService.get('MONGO_USERNAME');
	const password = configService.get('MONGO_PASSWORD');
	const dbName = configService.get('MONGO_DEFAULT_DB_NAME');
	const port = configService.get('MONGO_PORT');
	
	return `mongodb://${username}:${password}@${host}:${port}/${dbName}?authMechanism=DEFAULT`;
};

export const MongooseConfig = {
	imports: [ConfigModule],
	inject: [ConfigService],
	useFactory: getMongoConfig,
};