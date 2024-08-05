type Args = {
    sourceDir?: string;
    packagePath?: string;
    outputDir?: string;
};
export declare function run(args: Args): Promise<{
    error: boolean;
    errors: string[];
} | {
    error: boolean;
    errors?: undefined;
}>;
export {};
