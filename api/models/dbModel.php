<?php

    use Phalcon\Mvc\Model;

    class dbModel extends Model {

        /**
         * executes a raw sql statement
         * @param $sql
         * @return mixed
         */
        protected function executeRaw($sql) {

            $result = $this->getReadConnection()->query($sql);
            $result->setFetchMode(Phalcon\Db::FETCH_ASSOC);

            return $result->fetchAll($result);

        }
        //end executeRaw

    }
