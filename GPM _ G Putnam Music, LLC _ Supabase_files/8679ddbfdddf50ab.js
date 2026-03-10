;!function(){try { var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof global?global:"undefined"!=typeof window?window:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&((e._debugIds|| (e._debugIds={}))[n]="8ad0b427-02eb-a5f7-3f6c-43da8146c0f6")}catch(e){}}();
(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,670447,e=>{"use strict";var t=e.i(478902),s=e.i(975924),a=e.i(837710),r=e.i(627069),n=e.i(843778),i=e.i(10429);e.s(["BannerCard",0,({onDismiss:e,children:o,className:l})=>(0,t.jsxs)(r.Card,{className:(0,n.cn)("relative overflow-hidden shadow-lg rounded-2xl",l),children:[(0,t.jsxs)("div",{className:"absolute -inset-16 z-0 opacity-100 pointer-events-none",children:[(0,t.jsx)("img",{src:`${i.BASE_PATH}/img/reports/bg-grafana-dark.svg`,alt:"Background pattern",className:"w-full h-full object-cover object-right hidden dark:block"}),(0,t.jsx)("img",{src:`${i.BASE_PATH}/img/reports/bg-grafana-light.svg`,alt:"Background pattern",className:"w-full h-full object-cover object-right dark:hidden"}),(0,t.jsx)("div",{className:"absolute inset-0 bg-gradient-to-r from-background-alternative to-transparent"})]}),(0,t.jsxs)(r.CardContent,{className:"relative z-10 p-6",children:[e&&(0,t.jsx)("div",{className:"absolute top-4 right-4 z-20",children:(0,t.jsx)(a.Button,{type:"text",size:"tiny",htmlType:"button",icon:(0,t.jsx)(s.X,{size:16,strokeWidth:1.5}),onClick:t=>{t.preventDefault(),e()},className:"opacity-75 hover:opacity-100 px-1","aria-label":"Close banner"})}),o]})]})])},749199,e=>{"use strict";var t=e.i(242882),s=e.i(820308),a=e.i(150671),r=e.i(714403),n=e.i(635494),i=e.i(189329);e.s(["default",0,({sql:e,params:o=s.DEFAULT_QUERY_PARAMS,where:l,orderBy:c})=>{let{data:u}=(0,n.useSelectedProjectQuery)(),d=(0,i.useDatabaseSelectorStateSnapshot)(),{data:m}=(0,a.useReadReplicasQuery)({projectRef:u?.ref}),p=(m||[]).find(e=>e.identifier===d.selectedDatabaseId)?.connectionString,_=d.selectedDatabaseId,h="function"==typeof e?e([]):e,{data:g,error:f,isPending:x,isRefetching:y,refetch:b}=(0,t.useQuery)({queryKey:["projects",u?.ref,"db",{...o,sql:h,identifier:_},l,c],queryFn:({signal:e})=>(0,r.executeSql)({projectRef:u?.ref,connectionString:p||u?.connectionString,sql:h},e).then(e=>e.result),enabled:!!h,refetchOnWindowFocus:!1,refetchOnReconnect:!1});return{error:f||("object"==typeof g?g?.error:""),data:g,isLoading:x,isRefetching:y,params:o,runQuery:b,resolvedSql:h}}])},888525,760255,284399,e=>{"use strict";var t=e.i(355901),s=e.i(714403),a=e.i(392491);function r(e=[]){return{hypopg:e.find(e=>"hypopg"===e.name),indexAdvisor:e.find(e=>"index_advisor"===e.name)}}function n(e,t){return void 0===e||void 0===t||e<=0||e<=t?0:(e-t)/e*100}async function i({projectRef:e,connectionString:a,indexStatements:r,onSuccess:n,onError:i}){if(!e){let e=Error("Project ref is required");return i&&i(e),Promise.reject(e)}if(0===r.length){let e=Error("No index statements provided");return i&&i(e),Promise.reject(e)}try{return await (0,s.executeSql)({projectRef:e,connectionString:a,sql:r.join(";\n")+";"}),t.toast.success("Successfully created index"),n&&n(),Promise.resolve()}catch(e){return t.toast.error(`Failed to create index: ${e.message}`),i&&i(e),Promise.reject(e)}}function o(e,t){return!!(t&&e?.index_statements&&e.index_statements.length>0)}function l(e){return e&&0!==e.length?e.filter(e=>{let t=e.match(/ON\s+(?:"?(\w+)"?\.|(\w+)\.)/i);if(!t)return!0;let s=t[1]||t[2];return!s||!a.INTERNAL_SCHEMAS.includes(s.toLowerCase())}):[]}function c(e){if(!e||!e.index_statements)return e??null;let t=l(e.index_statements);return 0===t.length?null:{...e,index_statements:t}}function u(e){if(!e)return!1;let t=e.toLowerCase();return a.INTERNAL_SCHEMAS.some(e=>RegExp(`(?:from|join|update|insert\\s+into|delete\\s+from)\\s+(?:${e}\\.|"${e}"\\.)`,"i").test(t))}e.s(["calculateImprovement",()=>n,"createIndexes",()=>i,"filterProtectedSchemaIndexAdvisorResult",()=>c,"filterProtectedSchemaIndexStatements",()=>l,"getIndexAdvisorExtensions",()=>r,"hasIndexRecommendations",()=>o,"queryInvolvesProtectedSchemas",()=>u],760255);var d=e.i(450972),m=e.i(635494);function p(){let{data:e}=(0,m.useSelectedProjectQuery)(),{data:t}=(0,d.useDatabaseExtensionsQuery)({projectRef:e?.ref,connectionString:e?.connectionString}),{hypopg:s,indexAdvisor:a}=r(t??[]),n=!!s&&!!a,i=n&&null!==s.installed_version&&null!==a.installed_version;return{isIndexAdvisorAvailable:n,isIndexAdvisorEnabled:i}}e.s(["useIndexAdvisorStatus",()=>p],888525);var _=e.i(478902),h=e.i(389959),g=e.i(610144),f=e.i(967052),x=e.i(232520),y=e.i(837710);e.s(["EnableIndexAdvisorButton",0,()=>{let e=(0,f.useTrack)(),{data:s}=(0,m.useSelectedProjectQuery)(),[a,n]=(0,h.useState)(!1),{data:i}=(0,d.useDatabaseExtensionsQuery)({projectRef:s?.ref,connectionString:s?.connectionString}),{hypopg:o,indexAdvisor:l}=r(i),{mutateAsync:c,isPending:u}=(0,g.useDatabaseExtensionEnableMutation)(),p=async()=>{if(void 0===s)return t.toast.error("Project is required");try{o?.installed_version===null&&await c({projectRef:s?.ref,connectionString:s?.connectionString,name:o.name,schema:o?.schema??"extensions",version:o.default_version}),l?.installed_version===null&&await c({projectRef:s?.ref,connectionString:s?.connectionString,name:l.name,schema:l?.schema??"extensions",version:l.default_version}),t.toast.success("Successfully enabled Index Advisor!"),n(!1)}catch(e){t.toast.error(`Failed to enable Index Advisor: ${e.message}`)}};return(0,_.jsxs)(x.AlertDialog,{open:a,onOpenChange:()=>n(!a),children:[(0,_.jsx)(x.AlertDialogTrigger,{asChild:!0,children:(0,_.jsx)(y.Button,{type:"primary",onClick:()=>e("index_advisor_banner_enable_button_clicked"),children:"Enable"})}),(0,_.jsxs)(x.AlertDialogContent,{children:[(0,_.jsxs)(x.AlertDialogHeader,{children:[(0,_.jsx)(x.AlertDialogTitle,{children:"Enable Index Advisor"}),(0,_.jsxs)(x.AlertDialogDescription,{children:["This will enable the ",(0,_.jsx)("code",{className:"text-code-inline",children:"index_advisor"})," and"," ",(0,_.jsx)("code",{className:"text-code-inline",children:"hypopg"})," Postgres extensions so Index Advisor can analyse queries and suggest performance-improving indexes."]})]}),(0,_.jsxs)(x.AlertDialogFooter,{children:[(0,_.jsx)(x.AlertDialogCancel,{children:"Cancel"}),(0,_.jsx)(x.AlertDialogAction,{onClick:t=>{t.preventDefault(),p(),e("index_advisor_dialog_enable_button_clicked")},disabled:u,children:u?"Enabling...":"Enable"})]})]})]})}],284399)},298625,e=>{"use strict";var t=e.i(242882),s=e.i(714403),a=e.i(584258);async function r({projectRef:e,connectionString:t},a){let r=`
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
  `,{result:n}=await (0,s.executeSql)({projectRef:e,connectionString:t,sql:r,queryKey:["fdws"]},a);return n}e.s(["getFDWs",()=>r,"useFDWsQuery",0,({projectRef:e,connectionString:s},{enabled:n=!0,...i}={})=>(0,t.useQuery)({queryKey:a.fdwKeys.list(e),queryFn:({signal:t})=>r({projectRef:e,connectionString:s},t),enabled:n&&void 0!==e,...i})])},667286,e=>{"use strict";e.s(["databaseExtensionsKeys",0,{list:e=>["projects",e,"database-extensions"],defaultSchema:(e,t)=>["projects",e,"database-extensions",t,"default-schema"]}])},450972,e=>{"use strict";var t=e.i(248593),s=e.i(242882),a=e.i(234745),r=e.i(635494);e.i(10429);var n=e.i(837508),i=e.i(667286);async function o({projectRef:e,connectionString:s},r,n){if(!e)throw Error("projectRef is required");let i=new Headers(n);s&&i.set("x-connection-encrypted",s);let{data:o,error:l}=await (0,a.get)("/platform/pg-meta/{ref}/extensions",{params:{header:{"x-connection-encrypted":s,"x-pg-application-name":t.DEFAULT_PLATFORM_APPLICATION_NAME},path:{ref:e}},headers:i,signal:r});return l&&(0,a.handleError)(l),o}e.s(["useDatabaseExtensionsQuery",0,({projectRef:e,connectionString:t},{enabled:a=!0,...l}={})=>{let{data:c}=(0,r.useSelectedProjectQuery)(),u=c?.status===n.PROJECT_STATUS.ACTIVE_HEALTHY;return(0,s.useQuery)({queryKey:i.databaseExtensionsKeys.list(e),queryFn:({signal:s})=>o({projectRef:e,connectionString:t},s),enabled:a&&void 0!==e&&u,...l})}])},12214,e=>{"use strict";var t=e.i(615515);let s=e=>Object.fromEntries(e.map(e=>e.split("=")));function a(e,t){if("wasm_fdw_handler"===e.handlerName){let a=s(t?.server_options??[]);return e.server.options.find(e=>"fdw_package_name"===e.name)?.defaultValue===a.fdw_package_name}return e.handlerName===t?.handler}function r(e){return t.WRAPPERS.find(t=>a(t,e))}e.s(["convertKVStringArrayToJson",0,s,"formatWrapperTables",0,(e,s)=>(e?.tables??[]).map(a=>{let r=0,n=Object.fromEntries(a.options.map(e=>e.split("=")));switch(e.handler){case t.WRAPPER_HANDLERS.STRIPE:r=s?.tables.findIndex(e=>e.options.find(e=>"object"===e.name)?.defaultValue===n.object)??0;break;case t.WRAPPER_HANDLERS.FIREBASE:r="auth/users"===n.object?s?.tables.findIndex(e=>e.options.find(e=>"auth/users"===e.defaultValue))??0:s?.tables.findIndex(e=>"Firestore Collection"===e.label)??0;case t.WRAPPER_HANDLERS.S3:case t.WRAPPER_HANDLERS.AIRTABLE:case t.WRAPPER_HANDLERS.LOGFLARE:case t.WRAPPER_HANDLERS.BIG_QUERY:case t.WRAPPER_HANDLERS.CLICK_HOUSE:}return{...n,index:r,id:a.id,columns:a.columns,is_new_schema:!1,schema:a.schema,schema_name:a.schema,table_name:a.name}}),"getWrapperMetaForWrapper",()=>r,"makeValidateRequired",0,e=>{let t=new Set(e.filter(e=>e.required).map(e=>e.name)),s=new Set(Array.from(t).filter(e=>e.includes("."))),a=Array.from(s);return e=>Object.fromEntries(Object.entries(e).flatMap(([e,t])=>Array.isArray(t)?[[e,t],...t.map((t,s)=>[`${e}.${s}`,t])]:[[e,t]]).filter(([e,r])=>{let[n,i]=e.split(".");if(void 0!==i&&t.has(n)&&Object.keys(r).some(e=>s.has(`${n}.${e}`))){let e=a.find(e=>e.startsWith(`${n}.`));return!!e&&!r[e.split(".")[1]]}return t.has(n)&&(Array.isArray(r)?r.length<1:!r)}).map(([e])=>"table_name"===e?[e,"Please provide a name for your table"]:"columns"===e?[e,"Please select at least one column"]:[e,"This field is required"]))},"wrapperMetaComparator",()=>a])},584258,e=>{"use strict";e.s(["fdwKeys",0,{list:e=>["projects",e,"fdws"]}])},610144,e=>{"use strict";var t=e.i(755216),s=e.i(479084),a=e.i(38429),r=e.i(356003),n=e.i(355901),i=e.i(78162),o=e.i(714403),l=e.i(667286);async function c({projectRef:e,connectionString:a,schema:r,name:n,version:i,cascade:l=!1,createSchema:c=!1}){let u=new Headers;a&&u.set("x-connection-encrypted",a);let{sql:d}=t.default.extensions.create({schema:r,name:n,version:i,cascade:l}),{result:m}=await (0,o.executeSql)({projectRef:e,connectionString:a,sql:c?`create schema if not exists ${(0,s.ident)(r)}; ${d}`:d,queryKey:["extension","create"]});return m}e.s(["useDatabaseExtensionEnableMutation",0,({onSuccess:e,onError:t,...s}={})=>{let o=(0,r.useQueryClient)();return(0,a.useMutation)({mutationFn:e=>c(e),async onSuccess(t,s,a){let{projectRef:r}=s;await Promise.all([o.invalidateQueries({queryKey:l.databaseExtensionsKeys.list(r)}),o.invalidateQueries({queryKey:i.configKeys.upgradeEligibility(r)})]),await e?.(t,s,a)},async onError(e,s,a){void 0===t?n.toast.error(`Failed to enable database extension: ${e.message}`):t(e,s,a)},...s})}])},820308,775159,e=>{"use strict";var t,s,a=e.i(55956),r=((t={}).API="api",t.STORAGE="storage",t.AUTH="auth",t.QUERY_PERFORMANCE="query_performance",t.DATABASE="database",t);e.s(["Presets",()=>r],775159);var n=((s={}).LAST_10_MINUTES="Last 10 minutes",s.LAST_30_MINUTES="Last 30 minutes",s.LAST_60_MINUTES="Last 60 minutes",s.LAST_3_HOURS="Last 3 hours",s.LAST_24_HOURS="Last 24 hours",s.LAST_7_DAYS="Last 7 days",s.LAST_14_DAYS="Last 14 days",s.LAST_28_DAYS="Last 28 days",s);let i=[{text:"Last 10 minutes",calcFrom:()=>(0,a.default)().subtract(10,"minute").toISOString(),calcTo:()=>(0,a.default)().toISOString(),availableIn:["free","pro","team","enterprise","platform"]},{text:"Last 30 minutes",calcFrom:()=>(0,a.default)().subtract(30,"minute").toISOString(),calcTo:()=>(0,a.default)().toISOString(),availableIn:["free","pro","team","enterprise","platform"]},{text:"Last 60 minutes",calcFrom:()=>(0,a.default)().subtract(1,"hour").toISOString(),calcTo:()=>(0,a.default)().toISOString(),default:!0,availableIn:["free","pro","team","enterprise","platform"]},{text:"Last 3 hours",calcFrom:()=>(0,a.default)().subtract(3,"hour").toISOString(),calcTo:()=>(0,a.default)().toISOString(),availableIn:["free","pro","team","enterprise","platform"]},{text:"Last 24 hours",calcFrom:()=>(0,a.default)().subtract(1,"day").toISOString(),calcTo:()=>(0,a.default)().toISOString(),availableIn:["free","pro","team","enterprise","platform"]},{text:"Last 7 days",calcFrom:()=>(0,a.default)().subtract(7,"day").toISOString(),calcTo:()=>(0,a.default)().toISOString(),availableIn:["pro","team","enterprise"]},{text:"Last 14 days",calcFrom:()=>(0,a.default)().subtract(14,"day").toISOString(),calcTo:()=>(0,a.default)().toISOString(),availableIn:["team","enterprise"]},{text:"Last 28 days",calcFrom:()=>(0,a.default)().subtract(28,"day").toISOString(),calcTo:()=>(0,a.default)().toISOString(),availableIn:["team","enterprise"]}],o={iso_timestamp_start:i[0].calcFrom(),iso_timestamp_end:i[0].calcTo()},l=(e,t=!0)=>{if(0===e.length)return"";let s=e.map(e=>{let t=e.key.split("."),s=[t[t.length-2],t[t.length-1]].join("."),a=e.key.includes(".")?s:e.key,r=e.value.toString().includes('"')||e.value.toString().includes("'"),n=!isNaN(Number(e.value)),i=!n&&r?e.value:`'${e.value}'`,o=!n&&String(i).toLowerCase(),l=n?e.value:o;switch(e.compare){case"matches":return`REGEXP_CONTAINS(${a}, ${l})`;case"is":default:return`${a} = ${l}`;case"!=":return`${a} != ${l}`;case">=":return`${a} >= ${l}`;case"<=":return`${a} <= ${l}`;case">":return`${a} > ${l}`;case"<":return`${a} < ${l}`}}).filter(Boolean).join(" AND ");return""===s?"":t?"WHERE "+s:"AND "+s},c={[r.API]:{title:"API",queries:{totalRequests:{queryType:"logs",sql:e=>`
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
      LIMIT 5;`}}}};e.s(["DEFAULT_QUERY_PARAMS",0,o,"DEPRECATED_REPORTS",0,["total_realtime_ingress","total_rest_options_requests","total_auth_ingress","total_auth_get_requests","total_auth_post_requests","total_auth_patch_requests","total_auth_options_requests","total_storage_options_requests","total_storage_patch_requests","total_options_requests","total_rest_ingress","total_rest_get_requests","total_rest_post_requests","total_rest_patch_requests","total_rest_delete_requests","total_storage_get_requests","total_storage_post_requests","total_storage_delete_requests","total_auth_delete_requests","total_get_requests","total_patch_requests","total_post_requests","total_ingress","total_delete_requests"],"EDGE_FUNCTION_REGIONS",0,[{key:"ap-northeast-1",label:"Tokyo"},{key:"ap-northeast-2",label:"Seoul"},{key:"ap-south-1",label:"Mumbai"},{key:"ap-southeast-1",label:"Singapore"},{key:"ap-southeast-2",label:"Sydney"},{key:"ca-central-1",label:"Canada Central"},{key:"us-east-1",label:"N. Virginia"},{key:"us-west-1",label:"N. California"},{key:"us-west-2",label:"Oregon"},{key:"eu-central-1",label:"Frankfurt"},{key:"eu-west-1",label:"Ireland"},{key:"eu-west-2",label:"London"},{key:"eu-west-3",label:"Paris"},{key:"sa-east-1",label:"São Paulo"}],"LAYOUT_COLUMN_COUNT",0,2,"PRESET_CONFIG",0,c,"REPORTS_DATEPICKER_HELPERS",0,i,"REPORT_DATERANGE_HELPER_LABELS",()=>n,"generateRegexpWhere",0,l],820308)},25123,e=>{"use strict";var t=e.i(265735);function s(){let{data:e}=(0,t.useSelectedOrganizationQuery)();return e?{plan:e?.plan,usageBillingEnabled:e?.usage_billing_enabled,isLoading:!1,isSuccess:!0}:{plan:null,usageBillingEnabled:null,isLoading:!0,isSuccess:!1}}e.s(["useCurrentOrgPlan",()=>s])},582391,e=>{"use strict";let t=(0,e.i(388019).default)("Pen",[["path",{d:"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",key:"1a8usu"}]]);e.s(["Edit2",()=>t],582391)},303213,e=>{"use strict";var t=e.i(478902),s=e.i(435798),a=e.i(389959),r=e.i(355901),n=e.i(420985),i=e.i(635494),o=e.i(48189),l=e.i(432478),c=e.i(837710),u=e.i(441345),d=e.i(171997),m=e.i(40892);e.s(["CreateReportModal",0,({visible:e,onCancel:p,afterSubmit:_})=>{let h=(0,s.useRouter)(),{profile:g}=(0,l.useProfile)(),{data:f}=(0,i.useSelectedProjectQuery)(),x=f?.ref??"default",y=(0,a.useMemo)(()=>{let{its:e,ite:t,isHelper:s,helperText:a}=h.query,r=new URLSearchParams;e&&"string"==typeof e&&r.set("its",e),t&&"string"==typeof t&&r.set("ite",t),s&&"string"==typeof s&&r.set("isHelper",s),a&&"string"==typeof a&&r.set("helperText",a);let n=r.toString();return n?`?${n}`:""},[h.query]),{mutate:b,isPending:j}=(0,n.useContentUpsertMutation)({onSuccess:(e,t)=>{r.toast.success("Successfully created new report");let s=t.payload.id;h.push(`/project/${x}/observability/${s}${y}`),_()},onError:e=>{r.toast.error(`Failed to create report: ${e.message}`)}});async function v({name:e,description:t}){return x?g?void b({projectRef:x,payload:{id:(0,o.uuidv4)(),type:"report",name:e,description:t||"",visibility:"project",owner_id:g?.id,content:{schema_version:1,period_start:{time_period:"7d",date:""},period_end:{time_period:"today",date:""},interval:"1d",layout:[]}}}):console.error("Profile is required"):console.error("Project ref is required")}return(0,t.jsx)(m.Modal,{visible:e,onCancel:p,hideFooter:!0,header:"Create a custom report",size:"small",children:(0,t.jsx)(u.Form,{onReset:p,validateOnBlur:!0,initialValues:{name:"",description:""},validate:e=>{let t={};return e.name||(t.name="Required"),t},onSubmit:e=>v(e),children:()=>(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)(m.Modal.Content,{className:"space-y-4",children:[(0,t.jsx)(d.Input,{label:"Name",id:"name",name:"name"}),(0,t.jsx)(d.Input.TextArea,{label:"Description",id:"description",placeholder:"Describe your custom report",size:"medium",textAreaClassName:"resize-none"})]}),(0,t.jsx)(m.Modal.Separator,{}),(0,t.jsxs)(m.Modal.Content,{className:"flex items-center justify-end gap-2",children:[(0,t.jsx)(c.Button,{htmlType:"reset",type:"default",onClick:p,disabled:j,children:"Cancel"}),(0,t.jsx)(c.Button,{htmlType:"submit",loading:j,disabled:j,children:"Create report"})]})]})})})}])},23202,350106,e=>{"use strict";var t=e.i(478902);e.i(128328);var s=e.i(947748);e.i(69870);var a=e.i(158639),r=e.i(284399),n=e.i(124416),i=e.i(967052),o=e.i(924115),l=e.i(670447),c=e.i(470754);e.s(["BannerIndexAdvisor",0,()=>{let e=(0,i.useTrack)(),{ref:u}=(0,a.useParams)(),{dismissBanner:d}=(0,c.useBannerStack)(),[,m]=(0,n.useLocalStorageQuery)(s.LOCAL_STORAGE_KEYS.INDEX_ADVISOR_NOTICE_DISMISSED(u??""),!1);return(0,t.jsx)(l.BannerCard,{onDismiss:()=>{m(!0),d("index-advisor-banner"),e("index_advisor_banner_dismiss_button_clicked")},children:(0,t.jsxs)("div",{className:"flex flex-col gap-y-4",children:[(0,t.jsx)("div",{className:"flex flex-col gap-y-2 items-start",children:(0,t.jsx)("div",{className:"p-2 rounded-lg bg-warning-300 text-warning",children:(0,t.jsx)(o.Lightbulb,{size:16})})}),(0,t.jsxs)("div",{className:"flex flex-col gap-y-1 mb-2",children:[(0,t.jsx)("p",{className:"text-sm font-medium",children:"Enable Index Advisor"}),(0,t.jsx)("p",{className:"text-xs text-foreground-lighter text-balance",children:"Recommends indexes to improve query performance."})]}),(0,t.jsx)("div",{className:"flex gap-2",children:(0,t.jsx)(r.EnableIndexAdvisorButton,{})})]})})}],23202);var u=e.i(587433),d=e.i(223173),m=e.i(389959),p=e.i(837710),_=e.i(896088),h=e.i(10429);e.s(["BannerMetricsAPI",0,()=>{let{ref:e}=(0,a.useParams)(),r=(0,i.useTrack)(),{dismissBanner:o}=(0,c.useBannerStack)(),[,g]=(0,n.useLocalStorageQuery)(s.LOCAL_STORAGE_KEYS.OBSERVABILITY_BANNER_DISMISSED(e??""),!1);return(0,t.jsx)(l.BannerCard,{onDismiss:()=>{g(!0),o("metrics-api-banner"),r("metrics_api_banner_dismiss_button_clicked")},children:(0,t.jsxs)("div",{className:"flex flex-col gap-y-4",children:[(0,t.jsxs)("div",{className:"flex flex-col gap-y-2 items-start",children:[(0,t.jsx)(u.Badge,{variant:"success",className:"-ml-0.5 uppercase inline-flex items-center mb-2",children:"Beta"}),(0,t.jsx)("div",{className:"flex items-center gap-4",children:d.LOG_DRAIN_TYPES.filter(e=>"sentry"!==e.value).map(e=>(0,t.jsx)(m.default.Fragment,{children:m.default.cloneElement(e.icon,{height:20,width:20})},e.value))})]}),(0,t.jsxs)("div",{className:"flex flex-col gap-y-1 mb-2",children:[(0,t.jsx)("p",{className:"text-sm font-medium",children:"Export Metrics to your dashboards"}),(0,t.jsx)("p",{className:"text-xs text-foreground-lighter text-balance",children:"Visualize over 200 database performance and health metrics with our Metrics API."})]}),(0,t.jsx)("div",{className:"flex gap-2",children:(0,t.jsx)(p.Button,{type:"default",size:"tiny",asChild:!0,children:(0,t.jsx)(_.default,{href:`${h.DOCS_URL}/guides/telemetry/metrics`,target:"_blank",onClick:()=>r("metrics_api_banner_cta_button_clicked"),children:"Get started for free"})})})]})})}],350106)},212846,e=>{"use strict";var t=e.i(478902);e.i(128328);var s=e.i(86086),a=e.i(947748),r=e.i(158639),n=e.i(888525),i=e.i(23202),o=e.i(350106),l=e.i(470754),c=e.i(902780),u=e.i(912793),d=e.i(124416),m=e.i(951138),p=e.i(520705),_=e.i(389959),h=e.i(825713),g=e.i(934302),f=e.i(657588),x=e.i(303213),y=e.i(355901),b=e.i(420985),j=e.i(837710),v=e.i(441345),S=e.i(171997),E=e.i(40892);let q=({selectedReport:e,initialValues:s,onCancel:a})=>{let{ref:n}=(0,r.useParams)(),{mutate:i,isPending:o}=(0,b.useContentUpsertMutation)({onSuccess:()=>{y.toast.success("Successfully updated report"),a()},onError:e=>{y.toast.error(`Failed to update report: ${e.message}`)}});return(0,t.jsx)(E.Modal,{visible:void 0!==e,onCancel:a,hideFooter:!0,header:"Update custom report",size:"small",children:(0,t.jsx)(v.Form,{onReset:a,validateOnBlur:!0,initialValues:s,validate:function(e){let t={};return e.name||(t.name="This field is required"),t},onSubmit:t=>n?e&&e.id?void(e.project_id&&i({projectRef:n,payload:{...e,owner_id:e.owner_id,project_id:e.project_id,id:e.id,name:t.name,description:t.description||""}})):void 0:console.error("Project ref is required"),children:()=>(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(E.Modal.Content,{children:(0,t.jsx)(S.Input,{label:"Name",id:"name",name:"name"})}),(0,t.jsx)(E.Modal.Content,{children:(0,t.jsx)(S.Input.TextArea,{label:"Description",id:"description",placeholder:"Describe your custom report",size:"medium",textAreaClassName:"resize-none"})}),(0,t.jsx)(E.Modal.Separator,{}),(0,t.jsxs)(E.Modal.Content,{className:"flex items-center justify-end gap-2",children:[(0,t.jsx)(j.Button,{htmlType:"reset",type:"default",onClick:a,disabled:o,children:"Cancel"}),(0,t.jsx)(j.Button,{htmlType:"submit",loading:o,disabled:o,children:"Save custom report"})]})]})})})};var A=e.i(215312),R=e.i(586011),w=e.i(929461),N=e.i(2579),T=e.i(10429),I=e.i(432478),k=e.i(479232),P=e.i(896088),C=e.i(435798),D=e.i(449024),O=e.i(843778),L=e.i(862326),$=e.i(498377),M=e.i(466472),F=e.i(108151),B=e.i(582391),H=e.i(211570),U=e.i(471998),W=e.i(874311);let Q=({item:e,pageKey:s,onSelectEdit:a,onSelectDelete:r})=>{let{profile:n}=(0,I.useProfile)(),{can:i}=(0,N.useAsyncCheckPermissions)(g.PermissionAction.UPDATE,"user_content",{resource:{type:"report",visibility:e.report.visibility,owner_id:e.report.owner_id},subject:{id:n?.id}});return(0,t.jsxs)(P.default,{className:(0,O.cn)("pr-2 h-7 pl-3 mt-1 text-foreground-light group-hover:text-foreground/80 text-sm","flex items-center justify-between rounded-md group relative",e.key===s?"bg-surface-300 text-foreground":"hover:text-foreground"),href:e.url,children:[(0,t.jsx)("div",{children:e.name}),i&&(0,t.jsxs)(W.DropdownMenu,{children:[(0,t.jsx)(W.DropdownMenuTrigger,{asChild:!0,children:(0,t.jsx)(j.Button,{type:"text",className:"px-1 opacity-50 hover:opacity-100",icon:(0,t.jsx)(U.MoreVertical,{size:12,strokeWidth:2}),onClick:e=>{e.preventDefault(),e.stopPropagation()}})}),(0,t.jsxs)(W.DropdownMenuContent,{align:"start",className:"w-32 *:gap-x-2",children:[(0,t.jsxs)(W.DropdownMenuItem,{onClick:t=>{t.preventDefault(),t.stopPropagation(),e.id&&a()},children:[(0,t.jsx)(B.Edit2,{size:12}),(0,t.jsx)("div",{children:"Rename report"})]}),(0,t.jsx)(W.DropdownMenuSeparator,{}),(0,t.jsxs)(W.DropdownMenuItem,{onClick:t=>{t.preventDefault(),t.stopPropagation(),e.id&&r()},children:[(0,t.jsx)(H.Trash,{size:12}),(0,t.jsx)("div",{children:"Delete report"})]})]})]})]},e.key+"-menukey")},Y=()=>{let e=(0,C.useRouter)(),{profile:s}=(0,I.useProfile)(),{ref:a,id:n}=(0,r.useParams)(),i=n||e.pathname.split("/")[4]||"observability",o=(0,f.useFlag)("observabilityOverview"),l=(0,u.useIsFeatureEnabled)("project_storage:all"),{can:c}=(0,N.useAsyncCheckPermissions)(g.PermissionAction.CREATE,"user_content",{resource:{type:"report",owner_id:s?.id},subject:{id:s?.id}}),d=(0,_.useMemo)(()=>{let{its:t,ite:s,isHelper:a,helperText:r}=e.query,n=new URLSearchParams;t&&"string"==typeof t&&n.set("its",t),s&&"string"==typeof s&&n.set("ite",s),a&&"string"==typeof a&&n.set("isHelper",a),r&&"string"==typeof r&&n.set("helperText",r);let i=n.toString();return i?`?${i}`:""},[e.query]),{data:m,isPending:p}=(0,w.useContentQuery)({projectRef:a,type:"report"}),{mutate:h,isPending:b}=(0,R.useContentDeleteMutation)({onSuccess:()=>{v(!1),y.toast.success("Successfully deleted report"),e.push(`/project/${a}/observability`)},onError:e=>{y.toast.error(`Failed to delete report: ${e.message}`)}}),[j,v]=(0,_.useState)(!1),[S,E]=(0,D.useQueryState)("newReport",D.parseAsBoolean.withDefault(!1).withOptions({history:"push",clearOnDefault:!0})),[B,H]=(0,_.useState)(),[U,W]=(0,_.useState)();function Y(e){return"report"===e.type}let G=function(){if(!m)return[];let e=m?.content.filter(Y);return(e?.sort((e,t)=>e.name<t.name?-1:+(e.name>t.name))).map((e,t)=>({id:e.id,name:e.name,description:e.description||"",key:e.id||t+"-report",url:`/project/${a}/observability/${e.id}${d}`,hasDropdownActions:!0,report:e}))}(),K=[{title:"GENERAL",key:"general-section",items:[...o?[{name:"Overview",key:"observability",url:`/project/${a}/observability${d}`}]:[],{name:"Query Performance",key:"query-performance",url:`/project/${a}/observability/query-performance${d}`},...T.IS_PLATFORM?[{name:"API Gateway",key:"api-overview",url:`/project/${a}/observability/api-overview${d}`}]:[]]},{title:"PRODUCT",key:"product-section",items:[{name:"Database",key:"database",url:`/project/${a}/observability/database${d}`},{name:"Data API",key:"postgrest",url:`/project/${a}/observability/postgrest${d}`},{name:"Auth",key:"auth",url:`/project/${a}/observability/auth${d}`},{name:"Edge Functions",key:"edge-functions",url:`/project/${a}/observability/edge-functions${d}`},...l?[{name:"Storage",key:"storage",url:`/project/${a}/observability/storage${d}`}]:[],{name:"Realtime",key:"realtime",url:`/project/${a}/observability/realtime${d}`}]}];return(0,t.jsx)(L.Menu,{type:"pills",className:"mt-6",children:p?(0,t.jsxs)("div",{className:"px-5 my-4 space-y-2",children:[(0,t.jsx)(F.ShimmeringLoader,{}),(0,t.jsx)(F.ShimmeringLoader,{className:"w-3/4"}),(0,t.jsx)(F.ShimmeringLoader,{className:"w-1/2"})]}):(0,t.jsxs)("div",{className:"flex flex-col gap-y-6",children:[K.map((e,s)=>(0,t.jsxs)(_.Fragment,{children:[(0,t.jsx)("div",{className:"h-px w-full bg-border-overlay first:hidden"}),(0,t.jsx)("div",{children:e.items&&e.items.length>0?(0,t.jsxs)("div",{className:"px-2",children:[(0,t.jsx)(L.Menu.Group,{title:(0,t.jsx)("span",{className:"uppercase font-mono",children:e.title})}),(0,t.jsx)("div",{className:"flex flex-col",children:e.items.map(e=>(0,t.jsx)("li",{className:(0,O.cn)("pr-2 mt-1 text-foreground-light group-hover:text-foreground/80 text-sm","flex items-center justify-between rounded-md group relative",e.key===i?"bg-surface-300 text-foreground":"hover:text-foreground"),children:(0,t.jsx)(P.default,{href:e.url,className:"flex-grow h-7 flex justify-between items-center pl-3",children:(0,t.jsx)("span",{children:e.name})})},e.key))},e.key)]}):null})]},s)),T.IS_PLATFORM&&(0,t.jsxs)(_.Fragment,{children:[(0,t.jsx)("div",{className:"h-px w-full bg-border-overlay"}),(0,t.jsxs)("div",{className:"mx-2",children:[(0,t.jsx)(L.Menu.Group,{title:(0,t.jsxs)("span",{className:"flex w-full items-center justify-between relative h-6",children:[(0,t.jsx)("span",{className:"uppercase font-mono",children:"Custom Reports"}),G.length>0&&(0,t.jsx)(A.ButtonTooltip,{type:"default",size:"tiny",icon:(0,t.jsx)(k.Plus,{}),disabled:!c,className:"flex items-center justify-center h-6 w-6 absolute top-0 -right-1",onClick:()=>{E(!0)},tooltip:{content:{side:"bottom",text:c?void 0:"You need additional permissions to create custom reports"}}})]})}),0===G.length?(0,t.jsx)("div",{className:"px-2",children:(0,t.jsx)($.InnerSideBarEmptyPanel,{title:"No custom reports yet",description:"Create and save custom reports to track your project metrics",actions:(0,t.jsx)(A.ButtonTooltip,{type:"default",icon:(0,t.jsx)(k.Plus,{}),disabled:!c,onClick:()=>{E(!0)},tooltip:{content:{side:"bottom",text:c?void 0:"You need additional permissions to create custom reports"}},children:"New custom report"})})}):(0,t.jsx)(t.Fragment,{children:G.map(e=>(0,t.jsx)(Q,{item:e,pageKey:i,onSelectEdit:()=>{W(e.report)},onSelectDelete:()=>{H(e.report),v(!0)}},e.id))})]})]}),(0,t.jsx)(q,{onCancel:()=>W(void 0),selectedReport:U,initialValues:{name:U?.name||"",description:U?.description||""}}),(0,t.jsx)(M.default,{title:"Delete custom report",confirmLabel:"Delete report",confirmLabelLoading:"Deleting report",size:"medium",loading:b,visible:j,onCancel:()=>v(!1),onConfirm:()=>void 0===a?console.error("Project ref is required"):B?.id===void 0?console.error("Report ID is required"):void h({projectRef:a,ids:[B.id]}),children:(0,t.jsx)("div",{className:"text-sm text-foreground-light grid gap-4",children:(0,t.jsx)("div",{className:"grid gap-1",children:(0,t.jsxs)("p",{children:["Are you sure you want to delete '",B?.name,"'?"]})})})}),(0,t.jsx)(x.CreateReportModal,{visible:S,onCancel:()=>E(!1),afterSubmit:()=>E(!1)})]})})},G=({title:e,children:m})=>{let{ref:g}=(0,r.useParams)(),f=(0,p.usePathname)(),{addBanner:x,dismissBanner:y}=(0,l.useBannerStack)(),{isIndexAdvisorAvailable:b,isIndexAdvisorEnabled:j}=(0,n.useIndexAdvisorStatus)(),[v]=(0,d.useLocalStorageQuery)(a.LOCAL_STORAGE_KEYS.OBSERVABILITY_BANNER_DISMISSED(g??""),!1),[S]=(0,d.useLocalStorageQuery)(a.LOCAL_STORAGE_KEYS.INDEX_ADVISOR_NOTICE_DISMISSED(g??""),!1);(0,_.useEffect)(()=>{!v&&s.IS_PLATFORM?x({id:"metrics-api-banner",isDismissed:!1,content:(0,t.jsx)(o.BannerMetricsAPI,{}),priority:1}):y("metrics-api-banner")},[v,x,y]);let E=(0,_.useRef)(f);(0,_.useEffect)(()=>{let e=f?.includes("/query-performance");e&&b&&!j&&!S?x({id:"index-advisor-banner",isDismissed:!1,content:(0,t.jsx)(i.BannerIndexAdvisor,{}),priority:3}):(S||!e||j)&&y("index-advisor-banner"),E.current=f},[f,b,j,S,x,y]);let{reportsAll:q}=(0,u.useIsFeatureEnabled)(["reports:all"]);return q?(0,t.jsx)(h.ProjectLayout,{title:e,product:"Observability",productMenu:(0,t.jsx)(Y,{}),isBlocking:!1,children:m}):(0,t.jsx)(c.UnknownInterface,{urlBack:`/project/${g}`})},K=(0,m.withAuth)(e=>{let{ref:s}=(0,r.useParams)(),{reportsAll:a}=(0,u.useIsFeatureEnabled)(["reports:all"]);return a?(0,t.jsx)(G,{...e}):(0,t.jsx)(c.UnknownInterface,{urlBack:`/project/${s}`})});e.s(["default",0,K],212846)}]);

//# debugId=8ad0b427-02eb-a5f7-3f6c-43da8146c0f6
//# sourceMappingURL=369437bbc158abad.js.map