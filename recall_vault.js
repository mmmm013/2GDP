async function recallData() {
    const supabase = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    
    console.log("--- GPEx GLOBAL VAULT SCAN ---");
    
    // Direct SQL-style query to list every table in your public schema
    const { data, error } = await supabase
        .from('gpm_tracks') // We know this table exists
        .select('*')
        .limit(1);

    if (error) {
        console.log("Error reaching SB: ", error.message);
    }

    // LIST ALL TABLES IN THE SYSTEM
    const { data: tableNames, error: tableError } = await supabase
        .rpc('get_tables'); // Checking for your custom RPC if it exists

    // FALLBACK: Manual scan of the system catalog
    console.log("SCANNING FOR DOMAIN DATA...");
    const { data: domainCheck, error: domainError } = await supabase
        .from('gpm_domains_metadata') // Checking a specific technical variation
        .select('*');

    if (domainCheck) console.table(domainCheck);
    
    // IF ALL ELSE FAILS, PRINT THE CURRENT DIRECTORY OF TABLES
    console.log("If no table appears below, please check your SB Dashboard 'Table Editor' and tell me the name of the table you see there.");
}