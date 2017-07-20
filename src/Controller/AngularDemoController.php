<?php
/**
 * The controller for the main page and API endpoints for the module.
 * Custom API endpoints were created since the views provided don't always provide enough information for the front end to function properly.
 */
namespace Drupal\d8_angular_blog_demo\Controller;

use Drupal\Component\Serialization\Json;
use Drupal\Core\Controller\ControllerBase;
use \Drupal\node\Entity\Node;
Use \Drupal\taxonomy\Entity\Term;
use \Drupal\User\Entity\User;

//use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

class AngularDemoController extends ControllerBase{

    const taxonomy_id = 'tags';

    private function article_count($opts = array()){
        return $this->get_default_query($opts)->count()->execute();
    }

    private function deserialize($obj, $stdObj = false){
        $serializer = \Drupal::service('serializer');
        if($stdObj){
            return json_decode(json_encode($obj),true);
        }
        return json_decode($serializer->serialize($obj, 'json', ['plugin_id' => 'entity']));
    }

    private function get_default_query($opts = array()){
        $query =  \Drupal::entityQuery('node')
            ->condition('status', 1)
            ->condition('type', "article");
        if(!empty($opts)){
            foreach($opts as $key=>$val){
                $query->condition($key, $val);
            }
        }
        return $query;
    }

    private function get_articles($offset, $opts = array()){
        $nids = $this->get_default_query($opts)
            ->sort('created', 'desc')
            ->range((is_null($offset) ? 0 : $offset), 10)
            ->execute();
        $nodes = Node::loadMultiple($nids);
        return $this->deserialize($nodes);
    }

    private function get_tags(){
        return \Drupal::service('entity_type.manager')
            ->getStorage("taxonomy_term")
            ->loadTree(self::taxonomy_id);
    }

    private function get_tag($tid){
        return $this->deserialize(Term::load($tid));
    }

    public function apiTags($tid, $offset = 0){
        $article_opts = array(
            'field_tags'=>$tid
        );

        $response = array(
            'article_count'=>$this->article_count($article_opts),
            'articles'=>$this->get_articles($offset, $article_opts),
            'tags'=>$this->deserialize(Term::load($tid))
        );
        return new JsonResponse($response);
    }

    public function apiMain($offset = 0){
        $articles = $this->get_articles($offset);

        $response = array(
            'article_count'=>$this->article_count(),
            'offset'=>$offset,
            'articles'=>$articles,
            'tags'=>$this->get_tags()
        );
        return new JsonResponse($response);
    }

    public function apiArticle($nid){
        $node = $this->deserialize(Node::load($nid));

        $response = array(
            'article'=>$node,
            'tag'=>$this->get_tag($node->field_tags[0]->target_id)
        );
        return new JsonResponse($response);
    }

    public function content(){
        return array(
            '#theme'=>'d8_angular_blog_demo',
            '#base_href'=>'/blog/angular-blog-demo',
            '#content'=>$this->t('Blog is loading...')
        );
    }
}