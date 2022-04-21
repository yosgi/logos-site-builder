import type {GetStaticPathsResult, GetStaticPropsContext, GetStaticPropsResult, PreviewData} from "next/types";
import {INavigationItemProps, IRouteParamForLocalFolder} from "../../types/data.types";
import {readFileSync} from "fs";
import {join} from "path";
import matter from "gray-matter";

// @ts-ignore
const sidebar: INavigationItemProps[] = require("/public/data/sidebar.min.json");

const getStaticPathsFromFolder = (dirname: string) => async(): Promise<GetStaticPathsResult<IRouteParamForLocalFolder>> => {
    return {
        paths: sidebar.map(({path}: INavigationItemProps) => ({params: {path}})),
        fallback: false
    }
}

export const getStaticPropsFromFolder = <O extends PreviewData>(dir: string) => async(context: GetStaticPropsContext<IRouteParamForLocalFolder, O>): Promise<GetStaticPropsResult<any>> => {
    const params = context.params!

    const navProps = sidebar.find((item: INavigationItemProps) => item.path.join("") === params.path.join(""));

    if(!navProps){
        return {
            notFound: true,
        }
    }

    const rawMD = readFileSync(join(process.cwd(), navProps.localPath), 'utf-8');
    const {data: metadata, content} = matter(rawMD);

    return {
        props: {
            markdown: {content, metadata},
            routeParams: params
        }
    };
}

export const markdownDataUtils = {
    getStaticPaths: getStaticPathsFromFolder,
    getStaticProps: getStaticPropsFromFolder
}