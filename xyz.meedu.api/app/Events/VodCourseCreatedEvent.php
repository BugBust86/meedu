<?php

/*
 * This file is part of the MeEdu.
 *
 * (c) 杭州白书科技有限公司
 */

namespace App\Events;

use Illuminate\Queue\SerializesModels;
use Illuminate\Foundation\Events\Dispatchable;

class VodCourseCreatedEvent
{
    use Dispatchable, SerializesModels;

    public $id;

    public $data = [];

    /**
     * @param $courseId
     * @param $title
     * @param $charge
     * @param $thumb
     * @param $shortDesc
     * @param $desc
     *
     * @codeCoverageIgnore
     */
    public function __construct($courseId, $title, $charge, $thumb, $shortDesc, $desc)
    {
        $this->id = $courseId;
        $this->data = [
            'title' => $title,
            'charge' => $charge,
            'thumb' => $thumb,
            'short_desc' => $shortDesc,
            'desc' => $desc,
        ];
    }
}
