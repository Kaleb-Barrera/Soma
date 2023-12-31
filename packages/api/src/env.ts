import z from 'zod';
import { type ZodFormattedError } from 'zod';

const formatErrors = (errors: ZodFormattedError<Map<string, string>, string>) =>
    Object.entries(errors)
        .map(([name, value]) => {
            if (value && '_errors' in value)
                return `${name}: ${value._errors.join(', ')}\n`;
        })
        .filter(Boolean);

const serverSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']),
    CLERK_SECRET_KEY: z.string(),
});

const serverEnv = serverSchema.safeParse(process.env);

if (!serverEnv.success) {
    console.error(
        '❌ Invalid environment variables:\n',
        ...formatErrors(serverEnv.error.format()),
    );
    throw new Error('Invalid environment variables');
}

const env = { ...serverEnv.data };

export default env;
