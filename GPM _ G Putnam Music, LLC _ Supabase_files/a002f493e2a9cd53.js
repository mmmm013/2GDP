;!function(){try { var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof global?global:"undefined"!=typeof window?window:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&((e._debugIds|| (e._debugIds={}))[n]="68040191-7812-e2fd-a1cd-f579a2e371a1")}catch(e){}}();
(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,670447,e=>{"use strict";var t=e.i(478902),s=e.i(975924),a=e.i(837710),r=e.i(627069),n=e.i(843778),o=e.i(10429);e.s(["BannerCard",0,({onDismiss:e,children:i,className:l})=>(0,t.jsxs)(r.Card,{className:(0,n.cn)("relative overflow-hidden shadow-lg rounded-2xl",l),children:[(0,t.jsxs)("div",{className:"absolute -inset-16 z-0 opacity-100 pointer-events-none",children:[(0,t.jsx)("img",{src:`${o.BASE_PATH}/img/reports/bg-grafana-dark.svg`,alt:"Background pattern",className:"w-full h-full object-cover object-right hidden dark:block"}),(0,t.jsx)("img",{src:`${o.BASE_PATH}/img/reports/bg-grafana-light.svg`,alt:"Background pattern",className:"w-full h-full object-cover object-right dark:hidden"}),(0,t.jsx)("div",{className:"absolute inset-0 bg-gradient-to-r from-background-alternative to-transparent"})]}),(0,t.jsxs)(r.CardContent,{className:"relative z-10 p-6",children:[e&&(0,t.jsx)("div",{className:"absolute top-4 right-4 z-20",children:(0,t.jsx)(a.Button,{type:"text",size:"tiny",htmlType:"button",icon:(0,t.jsx)(s.X,{size:16,strokeWidth:1.5}),onClick:t=>{t.preventDefault(),e()},className:"opacity-75 hover:opacity-100 px-1","aria-label":"Close banner"})}),i]})]})])},749199,e=>{"use strict";var t=e.i(242882),s=e.i(820308),a=e.i(150671),r=e.i(714403),n=e.i(635494),o=e.i(189329);e.s(["default",0,({sql:e,params:i=s.DEFAULT_QUERY_PARAMS,where:l,orderBy:c})=>{let{data:u}=(0,n.useSelectedProjectQuery)(),m=(0,o.useDatabaseSelectorStateSnapshot)(),{data:_}=(0,a.useReadReplicasQuery)({projectRef:u?.ref}),d=(_||[]).find(e=>e.identifier===m.selectedDatabaseId)?.connectionString,p=m.selectedDatabaseId,h="function"==typeof e?e([]):e,{data:g,error:f,isPending:b,isRefetching:y,refetch:x}=(0,t.useQuery)({queryKey:["projects",u?.ref,"db",{...i,sql:h,identifier:p},l,c],queryFn:({signal:e})=>(0,r.executeSql)({projectRef:u?.ref,connectionString:d||u?.connectionString,sql:h},e).then(e=>e.result),enabled:!!h,refetchOnWindowFocus:!1,refetchOnReconnect:!1});return{error:f||("object"==typeof g?g?.error:""),data:g,isLoading:b,isRefetching:y,params:i,runQuery:x,resolvedSql:h}}])},888525,760255,284399,e=>{"use strict";var t=e.i(355901),s=e.i(714403),a=e.i(392491);function r(e=[]){return{hypopg:e.find(e=>"hypopg"===e.name),indexAdvisor:e.find(e=>"index_advisor"===e.name)}}function n(e,t){return void 0===e||void 0===t||e<=0||e<=t?0:(e-t)/e*100}async function o({projectRef:e,connectionString:a,indexStatements:r,onSuccess:n,onError:o}){if(!e){let e=Error("Project ref is required");return o&&o(e),Promise.reject(e)}if(0===r.length){let e=Error("No index statements provided");return o&&o(e),Promise.reject(e)}try{return await (0,s.executeSql)({projectRef:e,connectionString:a,sql:r.join(";\n")+";"}),t.toast.success("Successfully created index"),n&&n(),Promise.resolve()}catch(e){return t.toast.error(`Failed to create index: ${e.message}`),o&&o(e),Promise.reject(e)}}function i(e,t){return!!(t&&e?.index_statements&&e.index_statements.length>0)}function l(e){return e&&0!==e.length?e.filter(e=>{let t=e.match(/ON\s+(?:"?(\w+)"?\.|(\w+)\.)/i);if(!t)return!0;let s=t[1]||t[2];return!s||!a.INTERNAL_SCHEMAS.includes(s.toLowerCase())}):[]}function c(e){if(!e||!e.index_statements)return e??null;let t=l(e.index_statements);return 0===t.length?null:{...e,index_statements:t}}function u(e){if(!e)return!1;let t=e.toLowerCase();return a.INTERNAL_SCHEMAS.some(e=>RegExp(`(?:from|join|update|insert\\s+into|delete\\s+from)\\s+(?:${e}\\.|"${e}"\\.)`,"i").test(t))}e.s(["calculateImprovement",()=>n,"createIndexes",()=>o,"filterProtectedSchemaIndexAdvisorResult",()=>c,"filterProtectedSchemaIndexStatements",()=>l,"getIndexAdvisorExtensions",()=>r,"hasIndexRecommendations",()=>i,"queryInvolvesProtectedSchemas",()=>u],760255);var m=e.i(450972),_=e.i(635494);function d(){let{data:e}=(0,_.useSelectedProjectQuery)(),{data:t}=(0,m.useDatabaseExtensionsQuery)({projectRef:e?.ref,connectionString:e?.connectionString}),{hypopg:s,indexAdvisor:a}=r(t??[]),n=!!s&&!!a,o=n&&null!==s.installed_version&&null!==a.installed_version;return{isIndexAdvisorAvailable:n,isIndexAdvisorEnabled:o}}e.s(["useIndexAdvisorStatus",()=>d],888525);var p=e.i(478902),h=e.i(389959),g=e.i(610144),f=e.i(967052),b=e.i(232520),y=e.i(837710);e.s(["EnableIndexAdvisorButton",0,()=>{let e=(0,f.useTrack)(),{data:s}=(0,_.useSelectedProjectQuery)(),[a,n]=(0,h.useState)(!1),{data:o}=(0,m.useDatabaseExtensionsQuery)({projectRef:s?.ref,connectionString:s?.connectionString}),{hypopg:i,indexAdvisor:l}=r(o),{mutateAsync:c,isPending:u}=(0,g.useDatabaseExtensionEnableMutation)(),d=async()=>{if(void 0===s)return t.toast.error("Project is required");try{i?.installed_version===null&&await c({projectRef:s?.ref,connectionString:s?.connectionString,name:i.name,schema:i?.schema??"extensions",version:i.default_version}),l?.installed_version===null&&await c({projectRef:s?.ref,connectionString:s?.connectionString,name:l.name,schema:l?.schema??"extensions",version:l.default_version}),t.toast.success("Successfully enabled Index Advisor!"),n(!1)}catch(e){t.toast.error(`Failed to enable Index Advisor: ${e.message}`)}};return(0,p.jsxs)(b.AlertDialog,{open:a,onOpenChange:()=>n(!a),children:[(0,p.jsx)(b.AlertDialogTrigger,{asChild:!0,children:(0,p.jsx)(y.Button,{type:"primary",onClick:()=>e("index_advisor_banner_enable_button_clicked"),children:"Enable"})}),(0,p.jsxs)(b.AlertDialogContent,{children:[(0,p.jsxs)(b.AlertDialogHeader,{children:[(0,p.jsx)(b.AlertDialogTitle,{children:"Enable Index Advisor"}),(0,p.jsxs)(b.AlertDialogDescription,{children:["This will enable the ",(0,p.jsx)("code",{className:"text-code-inline",children:"index_advisor"})," and"," ",(0,p.jsx)("code",{className:"text-code-inline",children:"hypopg"})," Postgres extensions so Index Advisor can analyse queries and suggest performance-improving indexes."]})]}),(0,p.jsxs)(b.AlertDialogFooter,{children:[(0,p.jsx)(b.AlertDialogCancel,{children:"Cancel"}),(0,p.jsx)(b.AlertDialogAction,{onClick:t=>{t.preventDefault(),d(),e("index_advisor_dialog_enable_button_clicked")},disabled:u,children:u?"Enabling...":"Enable"})]})]})]})}],284399)},298625,e=>{"use strict";var t=e.i(242882),s=e.i(714403),a=e.i(584258);async function r({projectRef:e,connectionString:t},a){let r=`
    select
      s.oid as "id",
      w.fdwname as "name",
      s.srvname as "server_name",
      s.srvoptions as "server_options",
      c.proname as "handler",
      (
        select jsonb_agg(
          jsonb_build_object(
            'id', c.oid::bigint,
            'schema', relnamespace::regnamespace::text,
            'name', c.relname,
            'columns', (
              select jsonb_agg(
                jsonb_build_object(
                  'name', a.attname,
                  'type', pg_catalog.format_type(a.atttypid, a.atttypmod)
                )
              )
              from pg_catalog.pg_attribute a
              where a.attrelid = c.oid and a.attnum > 0 and not a.attisdropped
            ),
            'options', t.ftoptions
          )
        )
        from pg_catalog.pg_class c
        join pg_catalog.pg_foreign_table t on c.oid = t.ftrelid
        where c.oid = any (select t.ftrelid from pg_catalog.pg_foreign_table t where t.ftserver = s.oid)
      ) as "tables"
    from pg_catalog.pg_foreign_server s
    join pg_catalog.pg_foreign_data_wrapper w on s.srvfdw = w.oid
    join pg_catalog.pg_proc c on w.fdwhandler = c.oid;
  `,{result:n}=await (0,s.executeSql)({projectRef:e,connectionString:t,sql:r,queryKey:["fdws"]},a);return n}e.s(["getFDWs",()=>r,"useFDWsQuery",0,({projectRef:e,connectionString:s},{enabled:n=!0,...o}={})=>(0,t.useQuery)({queryKey:a.fdwKeys.list(e),queryFn:({signal:t})=>r({projectRef:e,connectionString:s},t),enabled:n&&void 0!==e,...o})])},667286,e=>{"use strict";e.s(["databaseExtensionsKeys",0,{list:e=>["projects",e,"database-extensions"],defaultSchema:(e,t)=>["projects",e,"database-extensions",t,"default-schema"]}])},450972,e=>{"use strict";var t=e.i(248593),s=e.i(242882),a=e.i(234745),r=e.i(635494);e.i(10429);var n=e.i(837508),o=e.i(667286);async function i({projectRef:e,connectionString:s},r,n){if(!e)throw Error("projectRef is required");let o=new Headers(n);s&&o.set("x-connection-encrypted",s);let{data:i,error:l}=await (0,a.get)("/platform/pg-meta/{ref}/extensions",{params:{header:{"x-connection-encrypted":s,"x-pg-application-name":t.DEFAULT_PLATFORM_APPLICATION_NAME},path:{ref:e}},headers:o,signal:r});return l&&(0,a.handleError)(l),i}e.s(["useDatabaseExtensionsQuery",0,({projectRef:e,connectionString:t},{enabled:a=!0,...l}={})=>{let{data:c}=(0,r.useSelectedProjectQuery)(),u=c?.status===n.PROJECT_STATUS.ACTIVE_HEALTHY;return(0,s.useQuery)({queryKey:o.databaseExtensionsKeys.list(e),queryFn:({signal:s})=>i({projectRef:e,connectionString:t},s),enabled:a&&void 0!==e&&u,...l})}])},12214,e=>{"use strict";var t=e.i(615515);let s=e=>Object.fromEntries(e.map(e=>e.split("=")));function a(e,t){if("wasm_fdw_handler"===e.handlerName){let a=s(t?.server_options??[]);return e.server.options.find(e=>"fdw_package_name"===e.name)?.defaultValue===a.fdw_package_name}return e.handlerName===t?.handler}function r(e){return t.WRAPPERS.find(t=>a(t,e))}e.s(["convertKVStringArrayToJson",0,s,"formatWrapperTables",0,(e,s)=>(e?.tables??[]).map(a=>{let r=0,n=Object.fromEntries(a.options.map(e=>e.split("=")));switch(e.handler){case t.WRAPPER_HANDLERS.STRIPE:r=s?.tables.findIndex(e=>e.options.find(e=>"object"===e.name)?.defaultValue===n.object)??0;break;case t.WRAPPER_HANDLERS.FIREBASE:r="auth/users"===n.object?s?.tables.findIndex(e=>e.options.find(e=>"auth/users"===e.defaultValue))??0:s?.tables.findIndex(e=>"Firestore Collection"===e.label)??0;case t.WRAPPER_HANDLERS.S3:case t.WRAPPER_HANDLERS.AIRTABLE:case t.WRAPPER_HANDLERS.LOGFLARE:case t.WRAPPER_HANDLERS.BIG_QUERY:case t.WRAPPER_HANDLERS.CLICK_HOUSE:}return{...n,index:r,id:a.id,columns:a.columns,is_new_schema:!1,schema:a.schema,schema_name:a.schema,table_name:a.name}}),"getWrapperMetaForWrapper",()=>r,"makeValidateRequired",0,e=>{let t=new Set(e.filter(e=>e.required).map(e=>e.name)),s=new Set(Array.from(t).filter(e=>e.includes("."))),a=Array.from(s);return e=>Object.fromEntries(Object.entries(e).flatMap(([e,t])=>Array.isArray(t)?[[e,t],...t.map((t,s)=>[`${e}.${s}`,t])]:[[e,t]]).filter(([e,r])=>{let[n,o]=e.split(".");if(void 0!==o&&t.has(n)&&Object.keys(r).some(e=>s.has(`${n}.${e}`))){let e=a.find(e=>e.startsWith(`${n}.`));return!!e&&!r[e.split(".")[1]]}return t.has(n)&&(Array.isArray(r)?r.length<1:!r)}).map(([e])=>"table_name"===e?[e,"Please provide a name for your table"]:"columns"===e?[e,"Please select at least one column"]:[e,"This field is required"]))},"wrapperMetaComparator",()=>a])},584258,e=>{"use strict";e.s(["fdwKeys",0,{list:e=>["projects",e,"fdws"]}])},610144,e=>{"use strict";var t=e.i(755216),s=e.i(479084),a=e.i(38429),r=e.i(356003),n=e.i(355901),o=e.i(78162),i=e.i(714403),l=e.i(667286);async function c({projectRef:e,connectionString:a,schema:r,name:n,version:o,cascade:l=!1,createSchema:c=!1}){let u=new Headers;a&&u.set("x-connection-encrypted",a);let{sql:m}=t.default.extensions.create({schema:r,name:n,version:o,cascade:l}),{result:_}=await (0,i.executeSql)({projectRef:e,connectionString:a,sql:c?`create schema if not exists ${(0,s.ident)(r)}; ${m}`:m,queryKey:["extension","create"]});return _}e.s(["useDatabaseExtensionEnableMutation",0,({onSuccess:e,onError:t,...s}={})=>{let i=(0,r.useQueryClient)();return(0,a.useMutation)({mutationFn:e=>c(e),async onSuccess(t,s,a){let{projectRef:r}=s;await Promise.all([i.invalidateQueries({queryKey:l.databaseExtensionsKeys.list(r)}),i.invalidateQueries({queryKey:o.configKeys.upgradeEligibility(r)})]),await e?.(t,s,a)},async onError(e,s,a){void 0===t?n.toast.error(`Failed to enable database extension: ${e.message}`):t(e,s,a)},...s})}])},820308,775159,e=>{"use strict";var t,s,a=e.i(55956),r=((t={}).API="api",t.STORAGE="storage",t.AUTH="auth",t.QUERY_PERFORMANCE="query_performance",t.DATABASE="database",t);e.s(["Presets",()=>r],775159);var n=((s={}).LAST_10_MINUTES="Last 10 minutes",s.LAST_30_MINUTES="Last 30 minutes",s.LAST_60_MINUTES="Last 60 minutes",s.LAST_3_HOURS="Last 3 hours",s.LAST_24_HOURS="Last 24 hours",s.LAST_7_DAYS="Last 7 days",s.LAST_14_DAYS="Last 14 days",s.LAST_28_DAYS="Last 28 days",s);let o=[{text:"Last 10 minutes",calcFrom:()=>(0,a.default)().subtract(10,"minute").toISOString(),calcTo:()=>(0,a.default)().toISOString(),availableIn:["free","pro","team","enterprise","platform"]},{text:"Last 30 minutes",calcFrom:()=>(0,a.default)().subtract(30,"minute").toISOString(),calcTo:()=>(0,a.default)().toISOString(),availableIn:["free","pro","team","enterprise","platform"]},{text:"Last 60 minutes",calcFrom:()=>(0,a.default)().subtract(1,"hour").toISOString(),calcTo:()=>(0,a.default)().toISOString(),default:!0,availableIn:["free","pro","team","enterprise","platform"]},{text:"Last 3 hours",calcFrom:()=>(0,a.default)().subtract(3,"hour").toISOString(),calcTo:()=>(0,a.default)().toISOString(),availableIn:["free","pro","team","enterprise","platform"]},{text:"Last 24 hours",calcFrom:()=>(0,a.default)().subtract(1,"day").toISOString(),calcTo:()=>(0,a.default)().toISOString(),availableIn:["free","pro","team","enterprise","platform"]},{text:"Last 7 days",calcFrom:()=>(0,a.default)().subtract(7,"day").toISOString(),calcTo:()=>(0,a.default)().toISOString(),availableIn:["pro","team","enterprise"]},{text:"Last 14 days",calcFrom:()=>(0,a.default)().subtract(14,"day").toISOString(),calcTo:()=>(0,a.default)().toISOString(),availableIn:["team","enterprise"]},{text:"Last 28 days",calcFrom:()=>(0,a.default)().subtract(28,"day").toISOString(),calcTo:()=>(0,a.default)().toISOString(),availableIn:["team","enterprise"]}],i={iso_timestamp_start:o[0].calcFrom(),iso_timestamp_end:o[0].calcTo()},l=(e,t=!0)=>{if(0===e.length)return"";let s=e.map(e=>{let t=e.key.split("."),s=[t[t.length-2],t[t.length-1]].join("."),a=e.key.includes(".")?s:e.key,r=e.value.toString().includes('"')||e.value.toString().includes("'"),n=!isNaN(Number(e.value)),o=!n&&r?e.value:`'${e.value}'`,i=!n&&String(o).toLowerCase(),l=n?e.value:i;switch(e.compare){case"matches":return`REGEXP_CONTAINS(${a}, ${l})`;case"is":default:return`${a} = ${l}`;case"!=":return`${a} != ${l}`;case">=":return`${a} >= ${l}`;case"<=":return`${a} <= ${l}`;case">":return`${a} > ${l}`;case"<":return`${a} < ${l}`}}).filter(Boolean).join(" AND ");return""===s?"":t?"WHERE "+s:"AND "+s},c={[r.API]:{title:"API",queries:{totalRequests:{queryType:"logs",sql:e=>`
        -- reports-api-total-requests
        select
          cast(timestamp_trunc(t.timestamp, hour) as datetime) as timestamp,
          count(t.id) as count
        FROM edge_logs t
          cross join unnest(metadata) as m
          cross join unnest(m.response) as response
          cross join unnest(m.request) as request
          cross join unnest(request.headers) as headers
          ${l(e)}
        GROUP BY
          timestamp
        ORDER BY
          timestamp ASC`},topRoutes:{queryType:"logs",sql:e=>`
        -- reports-api-top-routes
        select
          request.path as path,
          request.method as method,
          request.search as search,
          response.status_code as status_code,
          count(t.id) as count
        from edge_logs t
          cross join unnest(metadata) as m
          cross join unnest(m.response) as response
          cross join unnest(m.request) as request
          cross join unnest(request.headers) as headers
          ${l(e)}
        group by
          request.path, request.method, request.search, response.status_code
        order by
          count desc
        limit 10
        `},errorCounts:{queryType:"logs",sql:e=>`
        -- reports-api-error-counts
        select
          cast(timestamp_trunc(t.timestamp, hour) as datetime) as timestamp,
          count(t.id) as count
        FROM edge_logs t
          cross join unnest(metadata) as m
          cross join unnest(m.response) as response
          cross join unnest(m.request) as request
          cross join unnest(request.headers) as headers
        WHERE
          response.status_code >= 400
        ${l(e,!1)}
        GROUP BY
          timestamp
        ORDER BY
          timestamp ASC
        `},topErrorRoutes:{queryType:"logs",sql:e=>`
        -- reports-api-top-error-routes
        select
          request.path as path,
          request.method as method,
          request.search as search,
          response.status_code as status_code,
          count(t.id) as count
        from edge_logs t
          cross join unnest(metadata) as m
          cross join unnest(m.response) as response
          cross join unnest(m.request) as request
          cross join unnest(request.headers) as headers
        where
          response.status_code >= 400
        ${l(e,!1)}
        group by
          request.path, request.method, request.search, response.status_code
        order by
          count desc
        limit 10
        `},responseSpeed:{queryType:"logs",sql:e=>`
        -- reports-api-response-speed
        select
          cast(timestamp_trunc(t.timestamp, hour) as datetime) as timestamp,
          avg(response.origin_time) as avg
        FROM
          edge_logs t
          cross join unnest(metadata) as m
          cross join unnest(m.response) as response
          cross join unnest(m.request) as request
          cross join unnest(request.headers) as headers
          ${l(e)}
        GROUP BY
          timestamp
        ORDER BY
          timestamp ASC
      `},topSlowRoutes:{queryType:"logs",sql:e=>`
        -- reports-api-top-slow-routes
        select
          request.path as path,
          request.method as method,
          request.search as search,
          response.status_code as status_code,
          count(t.id) as count,
          avg(response.origin_time) as avg
        from edge_logs t
          cross join unnest(metadata) as m
          cross join unnest(m.response) as response
          cross join unnest(m.request) as request
          cross join unnest(request.headers) as headers
        ${l(e)}
        group by
          request.path, request.method, request.search, response.status_code
        order by
          avg desc
        limit 10
        `},networkTraffic:{queryType:"logs",sql:e=>`
        -- reports-api-network-traffic
        select
          cast(timestamp_trunc(t.timestamp, hour) as datetime) as timestamp,
          coalesce(
            safe_divide(
              sum(
                cast(coalesce(headers.content_length, "0") as int64)
              ),
              1000000
            ),
            0
          ) as ingress_mb,
          coalesce(
            safe_divide(
              sum(
                cast(coalesce(resp_headers.content_length, "0") as int64)
              ),
              1000000
            ),
            0
          ) as egress_mb,
        FROM
          edge_logs t
          cross join unnest(metadata) as m
          cross join unnest(m.response) as response
          cross join unnest(m.request) as request
          cross join unnest(request.headers) as headers
          cross join unnest(response.headers) as resp_headers
          ${l(e)}
        GROUP BY
          timestamp
        ORDER BY
          timestamp ASC
        `},requestsByCountry:{queryType:"logs",sql:e=>`
        -- reports-api-requests-by-country
        select
          cf.country as country,
          count(t.id) as count
        from edge_logs t
          cross join unnest(metadata) as m
          cross join unnest(m.response) as response
          cross join unnest(m.request) as request
          cross join unnest(request.headers) as headers
          cross join unnest(request.cf) as cf
        where
          cf.country is not null
        ${l(e,!1)}
        group by
          cf.country
        `}}},[r.AUTH]:{title:"",queries:{}},[r.STORAGE]:{title:"Storage",queries:{cacheHitRate:{queryType:"logs",sql:e=>`
        -- reports-storage-cache-hit-rate
SELECT
  timestamp_trunc(timestamp, hour) as timestamp,
  countif( h.cf_cache_status in ('HIT', 'STALE', 'REVALIDATED', 'UPDATING') ) as hit_count,
  countif( h.cf_cache_status in ('MISS', 'NONE/UNKNOWN', 'EXPIRED', 'BYPASS', 'DYNAMIC') ) as miss_count
from edge_logs f
  cross join unnest(f.metadata) as m
  cross join unnest(m.request) as r
  cross join unnest(m.response) as res
  cross join unnest(res.headers) as h
where starts_with(r.path, '/storage/v1/object') and r.method = 'GET'
  ${l(e,!1)}
group by timestamp
order by timestamp desc
`},topCacheMisses:{queryType:"logs",sql:e=>`
        -- reports-storage-top-cache-misses
SELECT
  r.path as path,
  r.search as search,
  count(id) as count
from edge_logs f
  cross join unnest(f.metadata) as m
  cross join unnest(m.request) as r
  cross join unnest(m.response) as res
  cross join unnest(res.headers) as h
where starts_with(r.path, '/storage/v1/object')
  and r.method = 'GET'
  and h.cf_cache_status in ('MISS', 'NONE/UNKNOWN', 'EXPIRED', 'BYPASS', 'DYNAMIC')
  ${l(e,!1)}
group by path, search
order by count desc
limit 12
    `}}},[r.QUERY_PERFORMANCE]:{title:"Query performance",queries:{mostFrequentlyInvoked:{queryType:"db",sql:(e,t,s,a=!1,r=!1)=>`
        -- reports-query-performance-most-frequently-invoked
set search_path to public, extensions;

select
    auth.rolname,
    statements.query,
    statements.calls,
    -- -- Postgres 13, 14, 15
    statements.total_exec_time + statements.total_plan_time as total_time,
    statements.min_exec_time + statements.min_plan_time as min_time,
    statements.max_exec_time + statements.max_plan_time as max_time,
    statements.mean_exec_time + statements.mean_plan_time as mean_time,
    -- -- Postgres <= 12
    -- total_time,
    -- min_time,
    -- max_time,
    -- mean_time,
    coalesce(statements.rows::numeric / nullif(statements.calls, 0), 0) as avg_rows,
    statements.rows as rows_read,
    case
      when (statements.shared_blks_hit + statements.shared_blks_read) > 0
      then round(
        (statements.shared_blks_hit * 100.0) /
        (statements.shared_blks_hit + statements.shared_blks_read),
        2
      )
      else 0
    end as cache_hit_rate${a?`,
    case
      when (lower(statements.query) like 'select%' or lower(statements.query) like 'with pgrst%')
      then (
        select json_build_object(
          'has_suggestion', array_length(index_statements, 1) > 0,
          'startup_cost_before', startup_cost_before,
          'startup_cost_after', startup_cost_after,
          'total_cost_before', total_cost_before,
          'total_cost_after', total_cost_after,
          'index_statements', index_statements
        )
        from index_advisor(statements.query)
      )
      else null
    end as index_advisor_result`:""}
  from pg_stat_statements as statements
    inner join pg_authid as auth on statements.userid = auth.oid
  -- skip queries that were never actually executed
  WHERE statements.calls > 0 ${t?t.replace(/^WHERE/,"AND"):""}
  ${s||"order by statements.calls desc"}
  limit 20`},mostTimeConsuming:{queryType:"db",sql:(e,t,s,a=!1,r=!1)=>`
        -- reports-query-performance-most-time-consuming
set search_path to public, extensions;

-- compute total time once up front so we don't need a window function over all rows
with grand_total as (
  select coalesce(nullif(sum(total_exec_time + total_plan_time), 0), 1) as v
  from pg_stat_statements where calls > 0
)
select
    auth.rolname,
    statements.query,
    statements.calls,
    statements.total_exec_time + statements.total_plan_time as total_time,
    statements.mean_exec_time + statements.mean_plan_time as mean_time,
    coalesce(
      ((statements.total_exec_time + statements.total_plan_time) /
        (select v from grand_total)) *
        100,
      0
    ) as prop_total_time${a?`,
    case
      when (lower(statements.query) like 'select%' or lower(statements.query) like 'with pgrst%')
      then (
        select json_build_object(
          'has_suggestion', array_length(index_statements, 1) > 0,
          'startup_cost_before', startup_cost_before,
          'startup_cost_after', startup_cost_after,
          'total_cost_before', total_cost_before,
          'total_cost_after', total_cost_after,
          'index_statements', index_statements
        )
        from index_advisor(statements.query)
      )
      else null
    end as index_advisor_result`:""}
  from pg_stat_statements as statements
    inner join pg_authid as auth on statements.userid = auth.oid
  -- skip queries that were never actually executed
  WHERE statements.calls > 0 ${t?t.replace(/^WHERE/,"AND"):""}
  ${s||"order by total_time desc"}
  limit 20`},slowestExecutionTime:{queryType:"db",sql:(e,t,s,a=!1,r=!1)=>`
        -- reports-query-performance-slowest-execution-time
set search_path to public, extensions;

select
    auth.rolname,
    statements.query,
    statements.calls,
    -- -- Postgres 13, 14, 15
    statements.total_exec_time + statements.total_plan_time as total_time,
    statements.min_exec_time + statements.min_plan_time as min_time,
    statements.max_exec_time + statements.max_plan_time as max_time,
    statements.mean_exec_time + statements.mean_plan_time as mean_time,
    -- -- Postgres <= 12
    -- total_time,
    -- min_time,
    -- max_time,
    -- mean_time,
    coalesce(statements.rows::numeric / nullif(statements.calls, 0), 0) as avg_rows${a?`,
    case
      when (lower(statements.query) like 'select%' or lower(statements.query) like 'with pgrst%')
      then (
        select json_build_object(
          'has_suggestion', array_length(index_statements, 1) > 0,
          'startup_cost_before', startup_cost_before,
          'startup_cost_after', startup_cost_after,
          'total_cost_before', total_cost_before,
          'total_cost_after', total_cost_after,
          'index_statements', index_statements
        )
        from index_advisor(statements.query)
      )
      else null
    end as index_advisor_result`:""}
  from pg_stat_statements as statements
    inner join pg_authid as auth on statements.userid = auth.oid
  -- skip queries that were never actually executed
  WHERE statements.calls > 0 ${t?t.replace(/^WHERE/,"AND"):""}
  ${s||"order by max_time desc"}
  limit 20`},queryHitRate:{queryType:"db",sql:e=>`-- reports-query-performance-cache-and-index-hit-rate
select
    'index hit rate' as name,
    (sum(idx_blks_hit)) / nullif(sum(idx_blks_hit + idx_blks_read),0) as ratio
  from pg_statio_user_indexes
  union all
  select
    'table hit rate' as name,
    sum(heap_blks_hit) / nullif(sum(heap_blks_hit) + sum(heap_blks_read),0) as ratio
  from pg_statio_user_tables;`},unified:{queryType:"db",sql:(e,t,s,a=!1,r=!1)=>`
        -- reports-query-performance-unified
        set search_path to public, extensions;

        -- compute total time once up front so we don't need a window function over all rows
        with grand_total as (
          select coalesce(nullif(sum(total_exec_time + total_plan_time), 0), 1) as v
          from pg_stat_statements where calls > 0
        ),
        base as (
          select
            auth.rolname,
            statements.query,
            statements.calls,
            statements.total_exec_time + statements.total_plan_time as total_time,
            statements.min_exec_time + statements.min_plan_time as min_time,
            statements.max_exec_time + statements.max_plan_time as max_time,
            statements.mean_exec_time + statements.mean_plan_time as mean_time,
            coalesce(statements.rows::numeric / nullif(statements.calls, 0), 0) as avg_rows,
            statements.rows as rows_read,
            statements.shared_blks_hit as debug_hit,
            statements.shared_blks_read as debug_read,
            case
              when (statements.shared_blks_hit + statements.shared_blks_read) > 0
              then (statements.shared_blks_hit::numeric * 100.0) /
                   (statements.shared_blks_hit + statements.shared_blks_read)
              else 0
            end as cache_hit_rate,
            coalesce(
              ((statements.total_exec_time + statements.total_plan_time) /
                (select v from grand_total)) *
                100,
              0
            ) as prop_total_time
          from pg_stat_statements as statements
            inner join pg_authid as auth on statements.userid = auth.oid
          -- skip queries that were never actually executed
          WHERE statements.calls > 0 ${t?t.replace(/^WHERE/,"AND"):""}
          ${s||"order by total_time desc"}
          limit 50
        ),
        query_results as (
          select
            base.*${a?`,
            case
              when (lower(base.query) like 'select%' or lower(base.query) like 'with pgrst%')
              then (
                select json_build_object(
                  'has_suggestion', array_length(index_statements, 1) > 0,
                  'startup_cost_before', startup_cost_before,
                  'startup_cost_after', startup_cost_after,
                  'total_cost_before', total_cost_before,
                  'total_cost_after', total_cost_after,
                  'index_statements', index_statements
                )
                from index_advisor(base.query)
              )
              else null
            end as index_advisor_result`:""}
          from base
        )
        select *
        from query_results
        ${r&&a?"where (index_advisor_result->>'has_suggestion')::boolean = true":""}
        ${s||"order by total_time desc"}
        limit 20`},slowQueriesCount:{queryType:"db",sql:()=>`
        -- reports-query-performance-slow-queries-count
        set search_path to public, extensions;

        -- Count of slow queries (> 1 second average)
        SELECT count(*) as slow_queries_count
        -- alias needed to reference columns in WHERE
        FROM pg_stat_statements as statements
        -- skip never-executed queries; mean_exec_time > 1000ms = avg over 1 second
        WHERE statements.calls > 0 AND statements.mean_exec_time > 1000;`},queryMetrics:{queryType:"db",sql:(e,t,s,a=!1,r=!1)=>`
        -- reports-query-performance-metrics
        set search_path to public, extensions;

        SELECT
          COALESCE(ROUND(AVG(statements.rows::numeric / NULLIF(statements.calls, 0)), 1), 0) as avg_rows_per_call,
          COUNT(*) FILTER (WHERE statements.total_exec_time + statements.total_plan_time > 1000) as slow_queries,
          COALESCE(
            ROUND(
              SUM(statements.shared_blks_hit) * 100.0 /
              NULLIF(SUM(statements.shared_blks_hit + statements.shared_blks_read), 0),
              2
            ), 0
          ) || '%' as cache_hit_rate
        FROM pg_stat_statements as statements
        -- skip queries that were never actually executed
        WHERE statements.calls > 0 ${t?t.replace(/^WHERE/,"AND"):""}
        ${s||""}`}}},[r.DATABASE]:{title:"database",queries:{largeObjects:{queryType:"db",sql:e=>`-- reports-database-large-objects
SELECT
        SCHEMA_NAME,
        relname,
        table_size
      FROM
        (SELECT
          pg_catalog.pg_namespace.nspname AS SCHEMA_NAME,
          relname,
          pg_total_relation_size(pg_catalog.pg_class.oid) AS table_size
        FROM pg_catalog.pg_class
        JOIN pg_catalog.pg_namespace ON relnamespace = pg_catalog.pg_namespace.oid
        ) t
      WHERE SCHEMA_NAME NOT LIKE 'pg_%'
      ORDER BY table_size DESC
      LIMIT 5;`}}}};e.s(["DEFAULT_QUERY_PARAMS",0,i,"DEPRECATED_REPORTS",0,["total_realtime_ingress","total_rest_options_requests","total_auth_ingress","total_auth_get_requests","total_auth_post_requests","total_auth_patch_requests","total_auth_options_requests","total_storage_options_requests","total_storage_patch_requests","total_options_requests","total_rest_ingress","total_rest_get_requests","total_rest_post_requests","total_rest_patch_requests","total_rest_delete_requests","total_storage_get_requests","total_storage_post_requests","total_storage_delete_requests","total_auth_delete_requests","total_get_requests","total_patch_requests","total_post_requests","total_ingress","total_delete_requests"],"EDGE_FUNCTION_REGIONS",0,[{key:"ap-northeast-1",label:"Tokyo"},{key:"ap-northeast-2",label:"Seoul"},{key:"ap-south-1",label:"Mumbai"},{key:"ap-southeast-1",label:"Singapore"},{key:"ap-southeast-2",label:"Sydney"},{key:"ca-central-1",label:"Canada Central"},{key:"us-east-1",label:"N. Virginia"},{key:"us-west-1",label:"N. California"},{key:"us-west-2",label:"Oregon"},{key:"eu-central-1",label:"Frankfurt"},{key:"eu-west-1",label:"Ireland"},{key:"eu-west-2",label:"London"},{key:"eu-west-3",label:"Paris"},{key:"sa-east-1",label:"São Paulo"}],"LAYOUT_COLUMN_COUNT",0,2,"PRESET_CONFIG",0,c,"REPORTS_DATEPICKER_HELPERS",0,o,"REPORT_DATERANGE_HELPER_LABELS",()=>n,"generateRegexpWhere",0,l],820308)},384429,e=>{"use strict";var t=e.i(698175);e.s(["Select",()=>t.default])},194576,e=>{"use strict";var t=e.i(478902),s=e.i(221287),a=e.i(938933);let r=({open:e,children:a,className:r,...n})=>(0,t.jsx)(s.Root,{asChild:n.asChild,defaultOpen:n.defaultOpen,open:e,onOpenChange:n.onOpenChange,disabled:n.disabled,className:r,children:a});r.Trigger=function({children:e,asChild:a}){return(0,t.jsx)(s.Trigger,{asChild:a,children:e})},r.Content=function({asChild:e,children:r,className:n}){let o=(0,a.default)("collapsible");return(0,t.jsx)(s.Content,{asChild:e,className:[o.content,n].join(" "),children:r})},e.s(["default",0,r])},58359,e=>{"use strict";var t=e.i(194576);e.s(["Collapsible",()=>t.default])},698175,e=>{"use strict";var t=e.i(478902),s=e.i(389959),a=e.i(753515),r=e.i(440401),n=e.i(701823),o=e.i(938933),i=e.i(140449);function l({autoComplete:e,autofocus:l,children:c,className:u,descriptionText:m,disabled:_,error:d,icon:p,id:h="",inputRef:g,label:f,afterLabel:b,beforeLabel:y,labelOptional:x,layout:q,name:E="",onChange:S,onBlur:v,placeholder:j,required:A,value:R,defaultValue:w,style:T,size:N="medium",borderless:O=!1,validation:I,...C}){let{formContextOnChange:k,values:L,errors:P,handleBlur:D,touched:$,fieldLevelValidation:F}=(0,i.useFormContext)();L&&!R&&(R=L[h]),d||(P&&!d&&(d=P[h||E]),d=$&&$[h||E]?d:void 0),(0,s.useEffect)(()=>{I&&F(h,I(R))},[]);let H=(0,o.default)("select"),M=[H.container];u&&M.push(u);let U=[H.base];return d&&U.push(H.variants.error),d||U.push(H.variants.standard),p&&U.push(H.with_icon[N]),N&&U.push(H.size[N]),_&&U.push(H.disabled),(0,t.jsx)(a.FormLayout,{label:f,afterLabel:b,beforeLabel:y,labelOptional:x,layout:q,id:h,error:d,descriptionText:m,className:u,style:T,size:N,children:(0,t.jsxs)("div",{className:H.container,children:[(0,t.jsx)("select",{id:h,name:E,"data-size":N,defaultValue:w,autoComplete:e,autoFocus:l,className:U.join(" "),onChange:function(e){S&&S(e),k&&k(e),I&&F(h,I(e.target.value))},onBlur:function(e){D&&D(e),v&&v(e)},ref:g,value:R,disabled:_,required:A,placeholder:j,...C,children:c}),p&&(0,t.jsx)(n.default,{size:N,icon:p}),d&&(0,t.jsx)("div",{className:H.actions_container,children:d&&(0,t.jsx)(r.default,{size:N})}),(0,t.jsx)("span",{className:H.chevron_container,children:(0,t.jsx)("svg",{className:H.chevron,xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor","aria-hidden":"true",children:(0,t.jsx)("path",{fillRule:"evenodd",d:"M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z",clipRule:"evenodd"})})})]})})}l.Option=function({value:e,children:s,selected:a}){return(0,t.jsx)("option",{value:e,selected:a,children:s})},l.OptGroup=function({label:e,children:s}){return(0,t.jsx)("optgroup",{label:e,children:s})},e.s(["default",0,l])}]);

//# debugId=68040191-7812-e2fd-a1cd-f579a2e371a1
//# sourceMappingURL=9b86511c5c1cbc95.js.map