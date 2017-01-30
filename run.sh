start_time=`date +%s`
rm config/db.json && rm lib/schema/ddl.json && rm lib/tables/registry.json && node index.js
end_time=`date +%s`
run_time=`expr $end_time - $start_time`
minutes=`expr $run_time / 60`
echo Total time to run: `echo $minutes` minutes.
