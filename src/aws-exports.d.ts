declare module 'aws-exports' {
    const config: {
        aws_project_region: string;
        aws_cloud_logic_custom: {
            name: string;
            endpoint: string;
            region: string;
        }[];
        // Add other config properties as needed
    };
    export default config;
}
