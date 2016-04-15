---
title: Building a Symfony bundle and Extending Sculpin
tags: [php, symfony, sculpin, composer, packagist, phpspec]
categories: [php]
related: 
    Sculpin - the static site generator: sculpin-static-site-generator

---

I've recently started using Sculpin as a site generator. However I wanted to add [Gulp](http://gulpjs.com) as a build tool. As a test of Sculpins extensibility I wanted to try and create a Symfony bundle that would run the `gulp` command during running the `sculpin generate` command.

I was using Gulp to compile and concatenate my SASS files, copy some JS files, and to generate some JSON files too.

# Building a Symfony Bundle

From the Symfony website

> A bundle is simply a structured set of files within a directory that implement a single feature. Each directory contains everything related to that feature, including PHP files, templates, stylesheets, JavaScript files, tests and anything else. Every aspect of a feature exists in a bundle and every feature lives in a bundle.

There's a lot of confusing conventions that may trip up a developer not too used to Symfony bundles and extensions.

The documentation seems to deal well with developing a package inside of a Symfony application, but I wanted to make this as a separate packagable bundle. Firstly, I created an empty composer project on my local machine, installed phpspec and sculpin as dev dependencies.

## Creating a Composer package and using it locally

Using `composer init` creates a composer.json file in your source directory and interactively walks through the steps needed to make a package, like requiring vendor/package name.

To install my dependencies I ran `composer require --dev phpspec/phpspec sculpin/sculpin`.

I also set a PSR-4 namespace in my composer.json file so my files could be autoloaded.
```json
{
    "autoload": {
        "psr-4": {
            "PeteMc\\Sculpin\\SculpinGulpBundle\\": "src/PeteMc/Sculpin/SculpinGulpBundle/"
        }
    }
}
```

I used `phpspec` to spec and generate my source code. 

```
phpspec d PeteMc/Sculpin/SculpinGulpBundle/SculpinGulpBundle
```

running `phpspec r` offered to create the class file for me, I said yes or _y_.

The only thing I needed to do with my new bundle file is check that it is a version of the Symfony Kernel Bundle. 

I added the following spec to make my spec file look like this:

```php
# /spec/PeteMc/Sculpin/SculpinGulpBundle/SculpinGulpBundleSpec.php
<?php

namespace spec\PeteMc\Sculpin\SculpinGulpBundle;

use PhpSpec\ObjectBehavior;
use Prophecy\Argument;
use Symfony\Component\HttpKernel\Bundle\Bundle;

class SculpinGulpBundleSpec extends ObjectBehavior
{
    function it_is_initializable()
    {
        $this->shouldHaveType('PeteMc\Sculpin\SculpinGulpBundle\SculpinGulpBundle');
    }

    function it_is_a_symfony_kernel_bundle()
    {
        $this->shouldImplement(Bundle::class);
    }
}
```

This failed my test, so then I could update my bundle source file to look like this:

```php
# /src/PeteMc/Sculpin/SculpinGulpBundle/SculpinGulpBundle.php
<?php

namespace PeteMc\Sculpin\SculpinGulpBundle;

use Symfony\Component\HttpKernel\Bundle\Bundle;

class SculpinGulpBundle extends Bundle
{
}
```

That'll do!

Next I wanted to include this in my Sculpin site, but in this state it wasn't ready to host on Packagist. Fortunately with Composer you can have dependencies on [local git projects](https://getcomposer.org/doc/05-repositories.md), perfect for development. Popping back to that project, I edited my `sculpin.json` file to look a bit like this:
```json
    "require": {
    	...,
        "petemc/sculpin-gulp-bundle": "@dev"
    },
    "repositories": [
        {
            "type":"vcs",
            "url":"/local/path/to/bundle/sculpin-gulp-bundle"
        }
    ]
```

And created a file called `SculpinKernel.php`, in the `app` dir, as instructed in the Sculpin docs.

```php
# app/SculpinKernel.php
<?php

class SculpinKernel extends \Sculpin\Bundle\SculpinBundle\HttpKernel\AbstractKernel
{
    protected function getAdditionalSculpinBundles()
    {
        return [
            'PeteMc\Sculpin\SculpinGulpBundle\SculpinGulpBundle'
        ];
    }
}
```

Remember to run `sculpin update` every time you change and commit your bundle, to get the latest changes.

Now my bundle was included, but not yet doing anything. Back to the bundle project.

## Writing the GulpGenerator

I wanted to spec a simple class that will run the `gulp` command every time the `sculpin generate` command is run. I used phpspec to generate my spec and source files with the following command

`phpspec d PeteMc/Sculpin/SculpinGulpBundle/GulpGenerator`

And I added a couple of specs, one to test it implements the Symfony event subscriber interface, and two to check it runs the gulp command if there are any changed files.

```php
# spec/PeteMc/Sculpin/SculpinGulpBundle/GulpGeneratorSpec.php
<?php

namespace spec\PeteMc\Sculpin\SculpinGulpBundle;

use PhpSpec\ObjectBehavior;
use Prophecy\Argument;
use Sculpin\Core\Event\SourceSetEvent;
use Sculpin\Core\Source\SourceInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Process\Process;

class GulpGeneratorSpec extends ObjectBehavior
{
    function it_implements_symfony_event_subscriber_interface()
    {
        $this->shouldImplement(EventSubscriberInterface::class);
    }

    function it_runs_the_gulp_command_if_there_are_changed_files(SourceSetEvent $sourceSetEvent, SourceInterface $source)
    {
        $sourceSetEvent->updatedSources()->willReturn([$source]);
        $this->getProcess($sourceSetEvent)->shouldBeLike(new Process('gulp sculpin'));
    }

    function it_does_not_run_the_gulp_command_if_there_are_no_changed_files(SourceSetEvent $sourceSetEvent)
    {
        $sourceSetEvent->updatedSources()->willReturn([]);
        $this->getProcess($sourceSetEvent)->shouldReturn(null);
    }
}
```

I added the following simple implementation
```php
# src/PeteMc/Sculpin/SculpinGulpBundle/GulpGenerator.php
<?php

namespace PeteMc\Sculpin\SculpinGulpBundle;

use Sculpin\Core\Event\SourceSetEvent;
use Sculpin\Core\Sculpin;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Process\Process;

class GulpGenerator implements EventSubscriberInterface
{
    /**
     * {@inheritdoc}
     */
    public static function getSubscribedEvents()
    {
        return [
            Sculpin::EVENT_AFTER_RUN => 'runGulp'
        ];
    }

    /**
     * @param  SourceSetEvent $sourceSetEvent
     */
    public function runGulp(SourceSetEvent $sourceSetEvent)
    {
        if ($process = $this->getProcess($sourceSetEvent)) {
            echo 'Running gulp.' . PHP_EOL;
            $process->run();
            echo $process->getOutput() . PHP_EOL;
        }
    }

    /**
     * @param  SourceSetEvent $sourceSetEvent
     *
     * @return null|Process
     */
    public function getProcess(SourceSetEvent $sourceSetEvent)
    {
        if ($sourceSetEvent->updatedSources()) {
            return new Process('gulp sculpin');
        }
        return null;
    }
}
```
I used the [Symfony Process component](http://symfony.com/doc/current/components/process.html) to wrap an executable sub-process. 

## Wiring it together

Now to access the Symfony Dependency Injection Container you have to create a PHP class which takes the name of your bundle, so `SculpinGulpBundle` but then replaces the word "Bundle" with "Extension", so in my case becomes `SculpinGulpExtension`. Oh, and that has to go in the `DependencyInjection` directory. This is just convention but it will load this file magically if you do as above, so I didn't ask any questions.

Here's what mine looked like:
```php
# src/PeteMc/Sculpin/SculpinGulpBundle/DependencyInjection/SculpinGulpExtension.php
<?php

namespace PeteMc\Sculpin\SculpinGulpBundle\DependencyInjection;

use Symfony\Component\Config\FileLocator;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Loader\XmlFileLoader;
use Symfony\Component\HttpKernel\DependencyInjection\Extension;

class SculpinGulpExtension extends Extension
{
    /**
     * {@inheritdoc}
     */
    public function load(array $configs, ContainerBuilder $container)
    {
        $loader = new XmlFileLoader($container, new FileLocator(__DIR__ . '/../Resources/config'));
        $loader->load('services.xml');
    }
}
```

In this `load` method, I created an XmlFileLoader, specified a directory called `Resources/config`, and loaded a file called `services.xml`, as I see is the convention.

Here's the interesting part, in `services.xml` you can wire up your application, add tags for the event listener, set parameters and all kinds of runtime magic!

```xml
<!-- src/PeteMc/Sculpin/SculpinGulpBundle/Resources/config/services.xml -->
<?xml version="1.0" ?>
<container xmlns="http://symfony.com/schema/dic/services" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://symfony.com/schema/dic/services http://symfony.com/schema/dic/services/services-1.0.xsd">
    <parameters>
        <parameter key="sculpin_gulp.generator.class">PeteMc\Sculpin\SculpinGulpBundle\GulpGenerator</parameter>
    </parameters>

    <services>
        <service id="sculpin_gulp.generator" class="%sculpin_gulp.generator.class%">
            <tag name="kernel.event_subscriber" />
        </service>
    </services>

</container>
```

Here we're defining a service, which will be available in the container through the unique name `sculpin_gulp.generator`. The `class` attribute tells Symfony which class to use. There is a convention to parameterize this, so I did above. I don't think this is necessary though and looks to me to just add more lines of beautiful XML.
The magic `tag` on my service tells Symfony to register my class as a listener or subscriber to events coming from the kernel. This is how we will sync with Sculpin, as Sculpin fires 6 different events at different stages of the `generate` lifecycle.

Save and commit your hard work, and run a `sculpin update` back in the Sculpin web project to get the latest package changes, then run `sculpin generate`
```bash
➜  petemcfarlane git:(master) ✗ sculpin generate
Detected new or updated files
Generating: 100% (80 sources / 0.00 seconds)
Converting: 100% (125 sources / 0.13 seconds)
Formatting: 100% (125 sources / 0.03 seconds)
Running gulp.
[10:12:32] Using gulpfile ~/Sites/petemcfarlane/gulpfile.js
[10:12:32] Task 'sculpin' is not in your gulpfile
[10:12:32] Please check the documentation for proper gulpfile formatting

Processing completed in 1.05 seconds
```
Success, well, kind of. We can see from the above output that we did run gulp, but that `Task 'sculpin' is not in your gulpfile`. Simple, in your `gulpfile.js` I just added a task and referenced a call to my `default` task like so:
```js
# gulpfile.js
...
gulp.task('sculpin', ['default']);
```

Run it again and it works!
```bash
➜  petemcfarlane git:(master) ✗ sculpin generate
Detected new or updated files
Generating: 100% (80 sources / 0.00 seconds)
Converting: 100% (125 sources / 0.16 seconds)
Formatting: 100% (125 sources / 0.04 seconds)
Running gulp.
[10:15:27] Using gulpfile ~/Sites/petemcfarlane/gulpfile.js
[10:15:27] Starting 'sass'...
[10:15:27] Starting 'bootstrap-js'...
[10:15:27] Finished 'bootstrap-js' after 38 ms
[10:15:28] Finished 'sass' after 712 ms
[10:15:28] Starting 'default'...
[10:15:28] Finished 'default' after 3.39 μs
[10:15:28] Starting 'sculpin'...
[10:15:28] Finished 'sculpin' after 2.19 μs

Processing completed in 1.61 seconds
```

## Publishing to Packagist

This was pretty simple, I created a github repo, pushed my changes, and went through the [Packagist submission process](https://packagist.org/packages/submit). Then in my website I could change my dependency to the public package, and remove my VCS repository. 

```
composer require petemc/sculpin-gulp-bundle
```

Full source for package: [https://github.com/petemcfarlane/sculpin-gulp-bundle](https://github.com/petemcfarlane/sculpin-gulp-bundle)