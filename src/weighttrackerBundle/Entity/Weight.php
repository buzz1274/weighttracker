<?php

    namespace weighttrackerBundle\Entity;

    use Doctrine\ORM\Mapping as ORM;

    /**
     * @ORM\Entity
     */
    class weight {

        /**
         * @ORM\Column(type="integer")
         * @ORM\Id
         * @ORM\GeneratedValue(strategy="AUTO")
         */
        protected $id;

        /**
         * @ORM\Column(type="decimal", precision=5, scale=2)
         */
        protected $weight;

        /**
         * @ORM\Column(type="date")
         */
        protected $date_added;

        public function findAll() {
            return $this->findBy(array(), array('date_added' => 'DESC'));
        }

    }
