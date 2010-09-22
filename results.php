<?

$results = array();

$results[] = array("title" => "Card One",   "description" => "<h1>Card One</h1>This is some dummy text",   "link" => "http://www.google.com", "rendered" => false);
$results[] = array("title" => "Card Two",   "description" => "<h1>Card Two</h1>This is some dummy text",   "link" => "http://www.google.com", "rendered" => false);
$results[] = array("title" => "Card Three", "description" => "<h1>Card Three</h1>This is some dummy text", "link" => "http://www.google.com", "rendered" => false);
$results[] = array("title" => "Card Four",  "description" => "<h1>Card Four</h1>This is some dummy text",  "link" => "http://www.google.com", "rendered" => false);
$results[] = array("title" => "Card Five",  "description" => "<h1>Card Five</h1>This is some dummy text",  "link" => "http://www.google.com", "rendered" => false);
$results[] = array("title" => "Card Six",   "description" => "<h1>Card Six</h1>This is some dummy text",   "link" => "http://www.google.com", "rendered" => false);
$results[] = array("title" => "Card Seven", "description" => "<h1>Card Seven</h1>This is some dummy text", "link" => "http://www.google.com", "rendered" => false);
$results[] = array("title" => "Card Eight", "description" => "<h1>Card Eight</h1>This is some dummy text", "link" => "http://www.google.com", "rendered" => false);
$results[] = array("title" => "Card Nine",  "description" => "<h1>Card Nine</h1>This is some dummy text",  "link" => "http://www.google.com", "rendered" => false);
$results[] = array("title" => "Card Ten",   "description" => "<h1>Card Ten</h1>This is some dummy text",   "link" => "http://www.google.com", "rendered" => false);

echo json_encode($results);

?>