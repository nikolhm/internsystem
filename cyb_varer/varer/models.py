from django.db import models

class Råvare(models.Model):
    STATUS_CHOICES = (
        ('OK', 'I bruk'),
        ('OLD', 'Utgått')
    )

    kategori = models.CharField(max_length=50)
    navn = models.CharField(max_length=100)
    mengde = models.FloatField()
    mengde_svinn = models.FloatField()
    enhet = models.CharField(max_length=20)
    innkjøpskonto = models.PositiveSmallIntegerField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='OK')

class Leverandør(models.Model):
    navn = models.CharField(max_length=100)
    kommentar = models.TextField()

class Råvarepris(models.Model):
    råvare = models.ForeignKey(Råvare, related_name='priser')
    leverandør = models.ForeignKey(Leverandør, related_name='priser')
    bestillingskode = models.CharField(max_length=30)
    pris = models.FloatField(help_text="Pris eks mva")
    dato = models.DateField()

class Salgsvare(models.Model):
    kategori = models.CharField(max_length=50)
    navn = models.CharField(max_length=100)
    salgskonto = models.PositiveSmallIntegerField()
    status = models.CharField(max_length=10, choices=Råvare.STATUS_CHOICES, default='OK')

class SalgsvareRåvare(models.Model):
    salgsvare = models.ForeignKey(Salgsvare)
    råvare = models.ForeignKey(Råvare)
    mengde = models.FloatField()

class SalgsvarePris(models.Model):
    STATUS_CHOICES = (
        ('FOR', 'Forslag'),
        ('GOD', 'Godkjent forslag'),
        ('KAS', 'Registrert i kasse')
    )

    salgsvare = models.ForeignKey(Salgsvare)
    status = models.CharField(max_length=3, choices=STATUS_CHOICES, default='FOR')
    dato = models.DateField()
    mva = models.PositiveSmallIntegerField()
    kassenr = models.PositiveSmallIntegerField(help_text="Nr i varekatalog i kassa")
    pris_intern = models.PositiveSmallIntegerField(help_text="Internpris INK mva")
    pris_ekstern = models.PositiveSmallIntegerField(help_text="Eksternpris INK mva")

class Salgskalkyle(models.Model):
    navn = models.CharField(max_length=30)
    kommentar = models.TextField()
    dato = models.DateField

class SalgskalkyleVare(models.Model):
    kalkyle = models.ForeignKey(Salgskalkyle, related_name='varer')
    salgsvare = models.ForeignKey(Salgsvare, related_name='kalkyler')
    interngrad = models.FloatField(null=True)
    antall = models.PositiveIntegerField()

class Varetelling(models.Model):
    tittel = models.CharField(max_length=50)
    kommentar = models.TextField()
    tid = models.DateTimeField()
    ansvarlig = models.CharField(max_length=100)

class VaretellingVare(models.Model):
    varetelling = models.ForeignKey(Varetelling, related_name='varer')
    råvare = models.ForeignKey(Råvare)
    sted = models.CharField(max_length=50)
    antall = models.FloatField()
    kommentar = models.CharField()
